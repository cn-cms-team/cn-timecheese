'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Plus, Timer } from 'lucide-react';
import type { DriveStep, Driver } from 'driver.js';

import { Button } from '@/components/ui/button';
import DaySelector from '../day-selector';
import TimelineList from '../timeline-list';
import AddActivityModal from '../activity-modal';
import type { DayItem, TimeSheetsResponse, TimelineItem } from '@/types/timesheet';
import {
  formatMonthLabel,
  formatTotalHours,
  getDayId,
  getDaysForMonth,
  parseDayId,
} from '@/lib/functions/timesheet-manage';
import { HeaderTitle } from '@/components/ui/custom/header';
import { TimeSheetMasterProvider } from './timesheet-master-context';
import { fetcher } from '@/lib/fetcher';
import { handleDeleteTimeSheet } from '../actions';
import { toast } from 'sonner';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';
import Image from 'next/image';
import Link from 'next/link';

const today = new Date();
const DEFAULT_MONTH_DATE = new Date(today.getFullYear(), today.getMonth(), 1);
const DEFAULT_SELECTED_DAY_ID = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const TIMESHEET_TOUR_STORAGE_KEY = 'timesheet-tour-completed:v1';
const TIMESHEET_TOUR_DESKTOP_MEDIA_QUERY = '(min-width: 1280px)';
const TIMESHEET_TOUR_MODAL_FIRST_STEP_INDEX = 2;

const TimeSheetViewContent = () => {
  const [currentMonth, setCurrentMonth] = useState(DEFAULT_MONTH_DATE);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [hourByDate, setHourByDate] = useState<Record<string, number>>({});
  const [holidayDates, setHolidayDates] = useState<string[]>([]);
  const [holidayNamesByDate, setHolidayNamesByDate] = useState<Record<string, string>>({});
  const [isHoursLoading, setIsHoursLoading] = useState(false);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [isTimelineLoading, setIsTimelineLoading] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [confirmState, setConfirmState] = useState<{
    title: string;
    message: string;
    confirmType?: ConfirmType;
  }>({
    title: '',
    message: '',
    confirmType: ConfirmType.DELETE,
  });
  const [hasCompletedTour, setHasCompletedTour] = useState(true);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const [skipTourForSession, setSkipTourForSession] = useState(false);
  const [getConfirmation, Confirmation] = useDialogConfirm();
  const driverRef = useRef<Driver | null>(null);
  const hasCompletedTourRef = useRef(true);

  const markTourAsCompleted = () => {
    if (hasCompletedTourRef.current || typeof window === 'undefined') {
      return;
    }

    hasCompletedTourRef.current = true;
    setHasCompletedTour(true);
    setSkipTourForSession(true);
    window.localStorage.setItem(TIMESHEET_TOUR_STORAGE_KEY, 'true');
  };

  const days = useMemo(
    () =>
      getDaysForMonth(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        hourByDate,
        holidayDates,
        holidayNamesByDate
      ),
    [currentMonth, hourByDate, holidayDates, holidayNamesByDate]
  );

  const [selectedDayId, setSelectedDayId] = useState<DayItem['id']>(
    days.find((day) => day.id === DEFAULT_SELECTED_DAY_ID)?.id ?? days[0].id
  );

  useEffect(() => {
    if (!days.some((day) => day.id === selectedDayId)) {
      setSelectedDayId(days[0].id);
    }
  }, [days, selectedDayId]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(TIMESHEET_TOUR_DESKTOP_MEDIA_QUERY);
    const syncViewport = () => {
      setIsDesktopViewport(mediaQueryList.matches);
    };

    hasCompletedTourRef.current =
      window.localStorage.getItem(TIMESHEET_TOUR_STORAGE_KEY) === 'true';
    setHasCompletedTour(hasCompletedTourRef.current);
    syncViewport();

    mediaQueryList.addEventListener('change', syncViewport);

    return () => {
      mediaQueryList.removeEventListener('change', syncViewport);
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadHoursByMonth = async () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const startDate = getDayId(year, month + 1, 1);
      const endDate = getDayId(year, month + 1, new Date(year, month + 1, 0).getDate());

      try {
        setIsHoursLoading(true);
        const query = new URLSearchParams({ startDate, endDate }).toString();
        const response = await fetcher<TimeSheetsResponse>(`/api/v1/timesheets?${query}`);

        if (!isActive) {
          return;
        }

        setHourByDate(response.hourData ?? {});
        setHolidayDates(response.holidayDates ?? []);
        setHolidayNamesByDate(response.holidayNamesByDate ?? {});
      } catch (error) {
        if (isActive) {
          console.error('Error fetching monthly timesheet summary:', error);
          setHourByDate({});
          setHolidayDates([]);
          setHolidayNamesByDate({});
        }
      } finally {
        if (isActive) {
          setIsHoursLoading(false);
        }
      }
    };

    loadHoursByMonth();

    return () => {
      isActive = false;
    };
  }, [currentMonth]);

  useEffect(() => {
    if (isDesktopViewport) {
      return;
    }

    if (driverRef.current?.isActive()) {
      driverRef.current.destroy();
      driverRef.current = null;
    }
  }, [isDesktopViewport]);

  useEffect(() => {
    if (hasCompletedTour || skipTourForSession || !isDesktopViewport || isAddActivityOpen) {
      return;
    }

    if (driverRef.current) {
      return;
    }

    let isCancelled = false;
    const timeoutId = window.setTimeout(async () => {
      const dateSelector = document.querySelector('[data-timesheet-tour="date-selector"]');
      const addActivityButton = document.querySelector(
        '[data-timesheet-tour="add-activity-button"]'
      );

      if (!dateSelector || !addActivityButton || isCancelled) {
        return;
      }

      const { driver } = await import('driver.js');

      if (isCancelled) {
        return;
      }

      const steps: DriveStep[] = [
        {
          element: '[data-timesheet-tour="date-selector"]',
          popover: {
            title: 'เลือกวันที่',
            description: 'เลือกวันที่จากแถบด้านซ้ายเพื่อดูชั่วโมงรวมและรายการกิจกรรมของวันนั้น',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '[data-timesheet-tour="add-activity-button"]',
          popover: {
            title: 'เพิ่มกิจกรรม',
            description: 'กดปุ่มนี้เพื่อเปิดฟอร์มเพิ่มกิจกรรมของวันที่เลือกไว้',
            side: 'bottom',
            align: 'end',
            onNextClick: (_element, _step, options) => {
              setEditingItem(null);
              setIsAddActivityOpen(true);

              window.setTimeout(() => {
                options.driver.moveNext();
              }, 250);
            },
          },
        },
        {
          element: '[data-timesheet-tour="activity-work-options"]',
          popover: {
            title: 'รูปแบบการทำงาน',
            description:
              'เลือกว่าทำงานที่บ้านหรือทั้งวัน เพื่อให้ฟอร์มตั้งค่าเวลาให้เหมาะกับกิจกรรมนี้',
            side: 'bottom',
            align: 'start',
            onPrevClick: (_element, _step, options) => {
              setIsAddActivityOpen(false);

              window.setTimeout(() => {
                options.driver.movePrevious();
              }, 150);
            },
          },
        },
        {
          element: '[data-timesheet-tour="activity-time-range"]',
          popover: {
            title: 'เวลาเริ่มต้น สิ้นสุด',
            description:
              'กำหนดช่วงเวลาที่ทำงานในวันนั้น ถ้าทำงานทั้งวันสามารถใช้ตัวเลือกทั้งวันได้',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '[data-timesheet-tour="activity-break-time"]',
          popover: {
            title: 'เวลาพัก',
            description:
              'ถ้ามีเวลาพัก ให้เปิดตัวเลือกนี้แล้วระบุช่วงเวลาพัก เพื่อให้ระบบหักออกจากชั่วโมงทำงานสุทธิ',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '[data-timesheet-tour="activity-project-field"]',
          popover: {
            title: 'เลือกโครงการ',
            description: 'เลือกโครงการที่เกี่ยวข้องกับงานที่กำลังบันทึก',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '[data-timesheet-tour="activity-task-type-field"]',
          popover: {
            title: 'เลือกประเภทงาน',
            description: 'หลังเลือกโครงการแล้ว ให้ระบุประเภทงานเพื่อแยกหมวดหมู่กิจกรรม',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '[data-timesheet-tour="activity-detail-field"]',
          popover: {
            title: 'กรอกรายละเอียดงาน',
            description: 'สรุปสิ่งที่ทำให้ชัดเจน กระชับ และตรวจสอบย้อนหลังได้ง่าย',
            side: 'top',
            align: 'start',
          },
        },
        {
          element: '[data-timesheet-tour="activity-feeling-field"]',
          popover: {
            title: 'บันทึกความรู้สึกต่องาน',
            description: 'เลือกความรู้สึกของงานชิ้นนี้เพื่อใช้ดูแนวโน้มในการทำงานภายหลัง',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '[data-timesheet-tour="activity-remark-field"]',
          popover: {
            title: 'ปัญหาและข้อเสนอแนะ',
            description: 'ถ้ามีประเด็นหรือข้อเสนอแนะเพิ่มเติม สามารถกรอกในส่วนนี้ได้',
            side: 'top',
            align: 'start',
          },
        },
        {
          element: '[data-timesheet-tour="activity-save-button"]',
          popover: {
            title: 'บันทึกกิจกรรม',
            description:
              'เมื่อกรอกครบแล้วให้กดบันทึก ระบบจะจำว่าคุณดูคำแนะนำครบแล้วและจะไม่แสดงซ้ำอีก',
            side: 'top',
            align: 'center',
            onNextClick: (_element, _step, options) => {
              markTourAsCompleted();
              options.driver.destroy();
            },
          },
        },
      ];

      const driverInstance = driver({
        allowClose: false,
        allowKeyboardControl: true,
        animate: true,
        doneBtnText: 'เสร็จแล้ว',
        nextBtnText: 'ถัดไป',
        overlayOpacity: 0.72,
        popoverClass: 'timesheet-tour-popover',
        prevBtnText: 'ย้อนกลับ',
        showButtons: ['previous', 'next'],
        showProgress: true,
        smoothScroll: true,
        stagePadding: 12,
        stageRadius: 16,
        steps,
        onDestroyed: () => {
          driverRef.current = null;

          if (!hasCompletedTourRef.current) {
            setSkipTourForSession(true);
          }
        },
      });

      driverRef.current = driverInstance;
      driverInstance.drive();
    }, 400);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [hasCompletedTour, isAddActivityOpen, isDesktopViewport, skipTourForSession]);

  const monthLabel = useMemo(() => formatMonthLabel(currentMonth), [currentMonth]);

  const setCurrentMonthIfDifferent = (date: Date) => {
    setCurrentMonth((prev) => {
      if (prev.getFullYear() === date.getFullYear() && prev.getMonth() === date.getMonth()) {
        return prev;
      }

      return new Date(date.getFullYear(), date.getMonth(), 1);
    });
  };

  const handleMonthChange = (offset: number) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const selectedDay = useMemo(
    () => days.find((day) => day.id === selectedDayId) ?? days[0],
    [days, selectedDayId]
  );

  const selectedDayLabel = useMemo(() => {
    const selectedDate = parseDayId(selectedDayId);
    return selectedDate.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    });
  }, [selectedDayId]);

  const latestActivityEndDate = useMemo(() => {
    if (timelineItems.length === 0) {
      return null;
    }

    return timelineItems.reduce<Date | null>((latest, item) => {
      const currentEndDate = new Date(item.end_date);

      if (!latest || currentEndDate.getTime() > latest.getTime()) {
        return currentEndDate;
      }

      return latest;
    }, null);
  }, [timelineItems]);

  const loadTimeSheetsByDate = async (isActive: boolean) => {
    try {
      setIsTimelineLoading(true);
      const response = await fetcher<TimelineItem[]>(`/api/v1/timesheets/${selectedDayId}`);

      if (!isActive) {
        return;
      }

      setTimelineItems(response ?? []);
    } catch (error) {
      if (isActive) {
        setTimelineItems([]);
      }
    } finally {
      if (isActive) {
        setIsTimelineLoading(false);
      }
    }
  };

  useEffect(() => {
    let isActive = true;
    loadTimeSheetsByDate(isActive);

    return () => {
      isActive = false;
    };
  }, [selectedDayId]);

  const handleDayNavigate = (offset: number) => {
    const selectedDate = parseDayId(selectedDayId);
    const nextDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate() + offset
    );

    setCurrentMonthIfDifferent(nextDate);
    setSelectedDayId(getDayId(nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate()));
  };

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentMonthIfDifferent(now);
    setSelectedDayId(getDayId(now.getFullYear(), now.getMonth() + 1, now.getDate()));
  };

  const handleAddActivityOpen = () => {
    setEditingItem(null);
    setIsAddActivityOpen(true);
  };

  const handleEditActivityOpen = (item: TimelineItem) => {
    if (item.is_approved) {
      toast.info('รายการนี้อนุมัติแล้ว ไม่สามารถแก้ไขได้');
      return;
    }

    setEditingItem(item);
    setIsAddActivityOpen(true);
  };

  const handleActivityModalOpenChange = (open: boolean) => {
    if (
      !open &&
      driverRef.current?.isActive() &&
      !hasCompletedTourRef.current &&
      (driverRef.current.getActiveIndex() ?? -1) >= TIMESHEET_TOUR_MODAL_FIRST_STEP_INDEX
    ) {
      setSkipTourForSession(true);
      driverRef.current.destroy();
      driverRef.current = null;
    }

    setIsAddActivityOpen(open);

    if (!open) {
      setEditingItem(null);
    }
  };

  const handleActivitySaved = (savedHourData: Record<string, number>, savedDayId: string) => {
    setHourByDate((prev) => ({
      ...prev,
      [savedDayId]: savedHourData[savedDayId] ?? 0,
      ...savedHourData,
    }));

    if (!hasCompletedTourRef.current) {
      markTourAsCompleted();

      if (driverRef.current?.isActive()) {
        driverRef.current.destroy();
        driverRef.current = null;
      }
    }

    if (savedDayId !== selectedDayId) {
      const savedDate = parseDayId(savedDayId);
      setCurrentMonthIfDifferent(savedDate);
      setSelectedDayId(savedDayId);
    } else {
      loadTimeSheetsByDate(true);
    }
  };

  const handleDeleteActivity = async (item: TimelineItem) => {
    if (item.is_approved) {
      toast.info('รายการนี้อนุมัติแล้ว ไม่สามารถลบได้');
      return;
    }

    setConfirmState({
      title: 'ลบกิจกรรม',
      message: `คุณยืนยันที่จะลบกิจกรรม ${item.project_name} ใช่หรือไม่ ?`,
      confirmType: ConfirmType.DELETE,
    });

    const isConfirmed = await getConfirmation();
    if (!isConfirmed) {
      return;
    }

    try {
      setDeletingItemId(item.id);
      const result = await handleDeleteTimeSheet(item.id);

      if (result?.message) {
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      }

      if (!result?.success) {
        return;
      }

      const savedHourData = (result as { hourData?: Record<string, number> }).hourData ?? {};
      setHourByDate((prev) => ({
        ...prev,
        [selectedDayId]: savedHourData[selectedDayId] ?? 0,
        ...savedHourData,
      }));

      await loadTimeSheetsByDate(true);
    } catch (error) {
      console.error('Delete activity error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setDeletingItemId(null);
    }
  };

  return (
    <div className="m-3 flex h-[calc(100dvh-1.5rem)] min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/90 shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/60 px-4 py-4 xl:hidden">
        <div className="flex justify-between align-middle">
          <HeaderTitle title={monthLabel} leaveUrl="/" />
          <div className="">
            <Button
              aria-label="Today"
              className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              onClick={handleGoToToday}
              size="icon"
              type="button"
              title="Today"
            >
              <CalendarDays className="size-5" />
            </Button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
          <button
            aria-label="วันก่อนหน้า"
            className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => handleDayNavigate(-1)}
            type="button"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="text-center">
            <p className="text-sm text-slate-500">{selectedDay.dayLabel}</p>
            <p className="text-4xl leading-none font-black text-slate-900">{selectedDay.date}</p>
            <p className="mt-1 text-sm text-slate-500">
              รวมเวลา {formatTotalHours(selectedDay.totalHours)}
            </p>
          </div>

          <button
            aria-label="วันถัดไป"
            className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => handleDayNavigate(1)}
            type="button"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        <aside className="hidden min-h-0 w-82.5 shrink-0 border-r border-slate-200 bg-slate-50/60 xl:flex xl:flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <button
              className="text-slate-500 hover:text-slate-800 cursor-pointer"
              onClick={() => handleMonthChange(-1)}
              type="button"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold text-slate-900">{monthLabel}</p>
              <Button
                aria-label="Today"
                className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                onClick={handleGoToToday}
                size="icon"
                type="button"
                title="Today"
              >
                <CalendarDays className="size-4.5" />
              </Button>

              <button
                className="text-slate-500 hover:text-slate-800 cursor-pointer"
                onClick={() => handleMonthChange(1)}
                type="button"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>

          <div
            className="min-h-0 space-y-2 overflow-y-auto p-4"
            data-timesheet-tour="date-selector"
          >
            <DaySelector
              days={days}
              selectedDayId={selectedDayId}
              onSelectDay={setSelectedDayId}
              isLoading={isHoursLoading}
            />
          </div>
        </aside>

        <section className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl leading-tight font-extrabold text-slate-950 sm:text-4xl">
                  Activities
                </h2>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 sm:text-base">
                  <Clock3 className="size-4" />
                  <span>รวมเวลา {formatTotalHours(selectedDay.totalHours)}</span>
                </div>
              </div>

              <>
                <div className="hidden sm:inline-flex">
                  <div className="flex items-center gap-2">
                    <Link href="/pomodoro">
                      <Button className="rounded-2xl px-5 py-6 text-base font-semibold">
                        <Timer className="size-5" />
                        Pomodoro
                      </Button>
                    </Link>
                    <Button
                      data-timesheet-tour="add-activity-button"
                      className="rounded-2xl bg-black px-5 py-6 text-base font-semibold text-white hover:bg-black/90"
                      onClick={handleAddActivityOpen}
                    >
                      <Plus className="size-5" />
                      {`เพิ่มกิจกรรม ${selectedDayLabel}`}
                    </Button>
                  </div>
                </div>
                <div className="sm:hidden">
                  <div className="flex items-center gap-2">
                    <Link href="/pomodoro">
                      <Button className="rounded-2xl" aria-label="Pomodoro" size={'icon'}>
                        <Timer className="size-5" />
                      </Button>
                    </Link>
                    <Button
                      aria-label={`เพิ่มกิจกรรมวันที่ ${selectedDayLabel}`}
                      className="rounded-2xl bg-black text-white hover:bg-black/90"
                      onClick={handleAddActivityOpen}
                      size="icon"
                    >
                      <Plus className="size-5" />
                    </Button>
                  </div>
                </div>
              </>
            </div>
          </div>

          <div className="pointer-events-none absolute right-2 bottom-2 z-0 opacity-20 sm:right-4 sm:bottom-4 sm:opacity-25 xl:right-6 xl:bottom-6">
            <Image
              src="/img/timesheet/bg-timesheet-hamster.webp"
              alt=""
              aria-hidden="true"
              width={320}
              height={320}
              priority={false}
              className="h-auto w-36 select-none sm:w-44 md:w-56 xl:w-64 2xl:w-72"
            />
          </div>

          <div className="relative min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6">
            <div className="absolute top-0 bottom-0 left-18.75 w-px bg-slate-200 sm:left-24" />

            <div className="relative z-10 space-y-4 pb-36 sm:pb-44 xl:pb-56">
              <TimelineList
                timelineItems={timelineItems}
                isLoading={isTimelineLoading}
                onEditItem={handleEditActivityOpen}
                onDeleteItem={handleDeleteActivity}
                deletingItemId={deletingItemId}
              />
            </div>
          </div>
        </section>
      </div>

      <AddActivityModal
        selectedDayId={selectedDayId}
        open={isAddActivityOpen}
        initialItem={editingItem}
        latestActivityEndDate={latestActivityEndDate}
        onOpenChange={handleActivityModalOpenChange}
        onSaved={handleActivitySaved}
      />

      <Confirmation
        title={confirmState.title}
        message={confirmState.message}
        confirmType={confirmState.confirmType}
      />
    </div>
  );
};

const TimeSheetView = () => {
  return (
    <TimeSheetMasterProvider>
      <TimeSheetViewContent />
    </TimeSheetMasterProvider>
  );
};

export default TimeSheetView;
