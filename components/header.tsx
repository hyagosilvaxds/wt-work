import { Search, HelpCircle, MessageSquare, Zap, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import LogoutButton from "@/components/logout-button"

export function Header() {
  const { user } = useAuth()

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
            <LogoutButton 
              variant="ghost" 
              size="icon" 
              className="rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700"
              showText={false}
            />

            <div className="ml-4 flex items-center space-x-3 bg-gray-50 rounded-xl p-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuário'}</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
