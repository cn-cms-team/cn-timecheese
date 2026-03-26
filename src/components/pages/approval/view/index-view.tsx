import ModuleLayout from '@/components/layouts/ModuleLayout';
import ApprovalContent from '../approval-content';

const ApprovalView = () => {
  return (
    <ModuleLayout headerTitle={'รายการรออนุมัติ'} content={<ApprovalContent />}></ModuleLayout>
  );
};

export default ApprovalView;
