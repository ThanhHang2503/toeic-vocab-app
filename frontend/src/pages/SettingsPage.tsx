
import { Button } from '@/shared/components/Button';
import { 
  Settings as SettingsIcon, 
  Trash2, 
  RotateCcw, 
  Database, 
  ShieldAlert,
  Info
} from 'lucide-react';
import axiosInstance from '@/shared/lib/axios';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const handleResetProgress = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử lỗi sai không? Hành động này không thể hoàn tác.')) {
      try {
        await axiosInstance.delete('/mistakes/all');
        toast.success('Đã reset tiến trình thành công');
      } catch (err) {
        toast.error('Lỗi khi reset tiến trình');
      }
    }
  };

  const handleDeleteAllData = async () => {
    window.alert('Tính năng này đang được bảo trì. Vui lòng liên hệ quản trị viên.');
    // Logic for deleting all topics/vocab if needed
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <SettingsIcon size={32} />
          Cài đặt hệ thống
        </h1>
        <p className="text-gray-500 mt-1">Quản lý tài khoản và dữ liệu học tập của bạn</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Data Management Section */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Database className="text-primary" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Quản lý dữ liệu</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <p className="font-bold">Reset tiến trình</p>
                  <p className="text-sm text-gray-500">Xóa toàn bộ lịch sử lỗi sai và điểm số lưu trữ</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleResetProgress} className="text-orange-600 hover:bg-orange-50 hover:border-orange-200">
                Lập lại
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-danger/5 border border-danger/10">
              <div className="flex items-center gap-4">
                <div className="bg-danger/10 p-2 rounded-lg text-danger">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <p className="font-bold text-danger">Xóa toàn bộ dữ liệu</p>
                  <p className="text-sm text-gray-500">Xóa tất cả chủ đề và từ vựng bạn đã tạo</p>
                </div>
              </div>
              <Button variant="danger" size="sm" onClick={handleDeleteAllData}>
                <Trash2 size={16} className="mr-2" />
                Xóa tất cả
              </Button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="card bg-primary/5 border-primary/10">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Info size={20} />
            </div>
            <div>
              <h3 className="font-bold text-primary mb-1">Thông tin phiên bản</h3>
              <p className="text-sm text-gray-600">Phiên bản hiện tại: <span className="font-mono">v1.2.0-stable</span></p>
              <p className="text-sm text-gray-600 mt-2">
                Hệ thống đang chạy với Backend Spring Boot và Database MySQL thật trong môi trường Docker. 
                Tất cả hình ảnh được lưu trữ an toàn trong Volume của hệ thống.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
