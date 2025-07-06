import React from "react";
import Header from "./_components/Header";
import { SubscriptionProvider } from "../../components/SubscriptionProvider";

function DashboardLayout({children}){
    return(
        <SubscriptionProvider>
            <div className="min-h-screen bg-background">
                <Header/>
                <main className="container mx-auto px-4 py-8">
                    {children}
                </main>
            </div>
        </SubscriptionProvider>
    )
}
export default DashboardLayout;