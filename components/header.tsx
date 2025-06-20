import { Bell, Search, Calendar, Settings, HelpCircle, MessageSquare, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent ml-12 md:ml-0">
            
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-gray-100">
              <Calendar className="h-5 w-5 text-gray-600" />
            </Button>

           

            <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-xs animate-pulse">
                5
              </Badge>
            </Button>

            

            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100">
              <Settings className="h-5 w-5 text-gray-600" />
            </Button>

            <div className="ml-4 flex items-center space-x-3 bg-gray-50 rounded-xl p-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                <Zap className="h-4 w-4 text-primary-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
