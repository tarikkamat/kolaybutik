import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ALL_STATUS_VALUES,
    DIRECT_EVENT_TYPES,
    DIRECT_FORMAT_FIELDS,
    HPP_EVENT_TYPES,
    HPP_FORMAT_FIELDS,
    WebhookSettings,
} from '../types';

interface WebhookSettingsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    settings: WebhookSettings;
    onSettingsChange: (settings: WebhookSettings) => void;
    onSave: () => void;
}

export function WebhookSettingsDialog({
    isOpen,
    onOpenChange,
    settings,
    onSettingsChange,
    onSave,
}: WebhookSettingsDialogProps) {
    const toggleField = (field: string) => {
        const hiddenFields = settings.hiddenFields.includes(field)
            ? settings.hiddenFields.filter((f) => f !== field)
            : [...settings.hiddenFields, field];

        onSettingsChange({
            ...settings,
            hiddenFields,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Webhook Ayarları</DialogTitle>
                    <DialogDescription>
                        Webhook görüntüleme ayarlarınızı yapılandırın. Bu
                        ayarlar sadece sizin oturumunuz için geçerlidir.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    {/* Event Type Filter with Tabs */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Event Type Filtresi
                        </h3>
                        <div>
                            <Label htmlFor="event-type">
                                Sadece belirli event type'ları göster
                            </Label>
                            <div className="mt-2">
                                <Tabs defaultValue="direct" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="direct">
                                            Direkt Format
                                        </TabsTrigger>
                                        <TabsTrigger value="hpp">
                                            HPP Format
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent
                                        value="direct"
                                        className="mt-4"
                                    >
                                        <MultiSelect
                                            options={DIRECT_EVENT_TYPES.map(
                                                (type) => ({
                                                    label: type,
                                                    value: type,
                                                }),
                                            )}
                                            selected={
                                                settings.eventTypeFilter || []
                                            }
                                            onChange={(selected) =>
                                                onSettingsChange({
                                                    ...settings,
                                                    eventTypeFilter: selected,
                                                })
                                            }
                                            placeholder="Event type seçiniz..."
                                            searchPlaceholder="Event type ara..."
                                            emptyMessage="Event type bulunamadı."
                                        />
                                    </TabsContent>
                                    <TabsContent value="hpp" className="mt-4">
                                        <MultiSelect
                                            options={HPP_EVENT_TYPES.map(
                                                (type) => ({
                                                    label: type,
                                                    value: type,
                                                }),
                                            )}
                                            selected={
                                                settings.eventTypeFilter || []
                                            }
                                            onChange={(selected) =>
                                                onSettingsChange({
                                                    ...settings,
                                                    eventTypeFilter: selected,
                                                })
                                            }
                                            placeholder="Event type seçiniz..."
                                            searchPlaceholder="Event type ara..."
                                            emptyMessage="Event type bulunamadı."
                                        />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Status Filtresi
                        </h3>
                        <div>
                            <Label htmlFor="status">
                                Sadece belirli status'ları göster
                            </Label>
                            <div className="mt-2">
                                <MultiSelect
                                    options={ALL_STATUS_VALUES.map(
                                        (status) => ({
                                            label: status,
                                            value: status,
                                        }),
                                    )}
                                    selected={settings.statusFilter || []}
                                    onChange={(selected) =>
                                        onSettingsChange({
                                            ...settings,
                                            statusFilter: selected,
                                        })
                                    }
                                    placeholder="Status seçiniz..."
                                    searchPlaceholder="Status ara..."
                                    emptyMessage="Status bulunamadı."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Hidden Fields with Tabs */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Gizlenecek Body Alanları
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            Seçtiğiniz alanlar webhook body'sinden
                            gizlenecektir.
                        </p>
                        <Tabs defaultValue="direct" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="direct">
                                    Direkt Format
                                </TabsTrigger>
                                <TabsTrigger value="hpp">
                                    HPP Format
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="direct" className="mt-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {DIRECT_FORMAT_FIELDS.map((field) => {
                                        const isHidden =
                                            settings.hiddenFields.includes(
                                                field,
                                            );
                                        return (
                                            <label
                                                key={field}
                                                className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isHidden}
                                                    onChange={() =>
                                                        toggleField(field)
                                                    }
                                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="text-sm text-slate-700 dark:text-slate-300">
                                                    {field}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </TabsContent>
                            <TabsContent value="hpp" className="mt-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {HPP_FORMAT_FIELDS.map((field) => {
                                        const isHidden =
                                            settings.hiddenFields.includes(
                                                field,
                                            );
                                        return (
                                            <label
                                                key={field}
                                                className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isHidden}
                                                    onChange={() =>
                                                        toggleField(field)
                                                    }
                                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="text-sm text-slate-700 dark:text-slate-300">
                                                    {field}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            onClick={() => {
                                onSettingsChange({
                                    hiddenFields: [],
                                    eventTypeFilter: [],
                                    statusFilter: [],
                                });
                            }}
                        >
                            Sıfırla
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="button" onClick={onSave}>
                            Kaydet
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
