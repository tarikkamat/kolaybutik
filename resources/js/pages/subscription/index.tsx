import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Package,
    CreditCard,
    Users,
    Repeat,
    Search,
    Edit,
    Trash2,
    Eye,
    ArrowLeft,
} from 'lucide-react';
import { ProductManagement } from './components/product-management';
import { PlanManagement } from './components/plan-management';
import { SubscriptionManagement } from './components/subscription-management';
import { CustomerManagement } from './components/customer-management';

export default function SubscriptionIndex() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Head title="Abonelik Yönetimi" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-4">
                        <Link href="/services">
                            <Button variant="ghost" className="mb-4">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Geri Dön
                            </Button>
                        </Link>
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
                        Abonelik Yönetimi
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        iyzico abonelik sistemi ile ürün, plan, abonelik ve abone yönetimi
                    </p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="products" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="products" className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Ürünler
                        </TabsTrigger>
                        <TabsTrigger value="plans" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Planlar
                        </TabsTrigger>
                        <TabsTrigger value="subscriptions" className="flex items-center gap-2">
                            <Repeat className="h-4 w-4" />
                            Abonelikler
                        </TabsTrigger>
                        <TabsTrigger value="customers" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Aboneler
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="products" className="space-y-4">
                        <ProductManagement />
                    </TabsContent>

                    <TabsContent value="plans" className="space-y-4">
                        <PlanManagement />
                    </TabsContent>

                    <TabsContent value="subscriptions" className="space-y-4">
                        <SubscriptionManagement />
                    </TabsContent>

                    <TabsContent value="customers" className="space-y-4">
                        <CustomerManagement />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

