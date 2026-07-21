import { useState } from 'react';
import { FormInput, Button } from '@/shared/components'

export const PasswordChangeForm = () => {
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const handleSave = () => {
        if (newPassword !== confirmPassword) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
        }
    };

    return (
        <section className='flex w-full flex-col rounded-2xl bg-white p-7'>
            <h3 className="mb-5 text-lg font-bold text-gray-900 leading-snug">
                비밀번호 변경
            </h3>

            <div className='flex flex-col gap-5'>
                {/* 현재 비밀번호 */}
                <div className='flex flex-col'>
                    <label htmlFor='currentPassword' className="mb-1 text-sm font-bold text-gray-900">
                        현재 비밀번호
                    </label>
                    <FormInput
                        id="currentPassword"
                        type="password"
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)} 
                        placeholder="현재 비밀번호"
                    />
                </div>

                {/* 새 비밀번호 & 비밀번호 확인 */}
                <div className='grid grid-cols-2 gap-5'>
                    <div className='flex flex-col'>
                        <label htmlFor='newPassword' className='mb-1 text-sm font-bold text-gray-900'>
                            새 비밀번호
                        </label>
                        <FormInput
                            id="newPassword"
                            type="password"
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            placeholder="새 비밀번호"
                            />
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor='confirmPassword' className='mb-1 text-sm font-bold text-gray-900'>
                            새 비밀번호 확인
                        </label>
                        <FormInput
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            placeholder="새 비밀번호 확인"
                            />
                    </div>
                </div>

                {/* 저장 버튼 */}
                <div className='mt-5 flex'>
                    <Button
                        variant="primary" 
                        size='md'
                        onClick={handleSave}
                        className='w-40'
                    >
                        저장
                    </Button>
                </div>
            </div>
        </section>
    );
};