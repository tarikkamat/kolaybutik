import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export interface UserInfo {
    name?: string;
    technicalLevel?: string;
    purpose?: string;
}

interface UserInfoFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (info: UserInfo) => void;
    initialData?: UserInfo;
}

export default function UserInfoForm({
    open,
    onClose,
    onSubmit,
    initialData,
}: UserInfoFormProps) {
    const [formData, setFormData] = useState<UserInfo>({
        name: initialData?.name || '',
        technicalLevel: initialData?.technicalLevel || '',
        purpose: initialData?.purpose || '',
    });

    // Update form data when initialData changes and dialog opens
    useEffect(() => {
        if (open) {
            setFormData({
                name: initialData?.name || '',
                technicalLevel: initialData?.technicalLevel || '',
                purpose: initialData?.purpose || '',
            });
        }
    }, [open, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const handleSkip = () => {
        onSubmit({});
        onClose();
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Size Daha İyi Yardımcı Olabilmem İçin</DialogTitle>
                    <DialogDescription>
                        Bu bilgiler size daha uygun yanıtlar almanızı sağlar. Tüm alanlar
                        opsiyoneldir, isterseniz atlayabilirsiniz.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Adınız (Opsiyonel)</Label>
                            <Input
                                id="name"
                                placeholder="Örn: Ahmet"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="technicalLevel">
                                Teknik Seviyeniz (Opsiyonel)
                            </Label>
                            <Select
                                value={formData.technicalLevel}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, technicalLevel: value })
                                }
                            >
                                <SelectTrigger id="technicalLevel">
                                    <SelectValue placeholder="Seviyenizi seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="beginner">Başlangıç</SelectItem>
                                    <SelectItem value="intermediate">Orta</SelectItem>
                                    <SelectItem value="advanced">İleri</SelectItem>
                                    <SelectItem value="expert">Uzman</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="purpose">Amaç (Opsiyonel)</Label>
                            <Textarea
                                id="purpose"
                                placeholder="Örn: iyzico API entegrasyonu yapmak istiyorum"
                                value={formData.purpose}
                                onChange={(e) =>
                                    setFormData({ ...formData, purpose: e.target.value })
                                }
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={handleSkip}>
                            Atla
                        </Button>
                        <Button type="submit">Kaydet</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
