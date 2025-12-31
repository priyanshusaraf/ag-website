'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Menu, Search, User, LogOut, X, Package } from 'lucide-react';
import CartSheet from '@/components/cart/CartSheet';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus the search input after it appears
      setTimeout(() => {
        document.getElementById('navbar-search')?.focus();
      }, 100);
    }
  };

  return (
    <nav className="navbar-sticky">
      <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-[72px] items-center justify-between">
            <>
            {/* Desktop: left navigation */}
            <div className="hidden md:flex items-center gap-8">
              <NavigationMenu>
                <NavigationMenuList className="gap-2">
                  <NavigationMenuItem>
                    <Link href="/" className="lookbook-kicker px-0 py-2 hover:text-foreground transition-colors">
                      Home
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/products" className="lookbook-kicker px-0 py-2 hover:text-foreground transition-colors">
                      Products
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/about" className="lookbook-kicker px-0 py-2 hover:text-foreground transition-colors">
                      About
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/contact" className="lookbook-kicker px-0 py-2 hover:text-foreground transition-colors">
                      Contact
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Brand */}
            <Link href="/" className="flex items-center">
              <span className="text-sm md:text-base font-light tracking-wide text-white/60">
                Andre
              </span>
            </Link>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Search */}
              <div className="relative">
                {isSearchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <input
                        id="navbar-search"
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-56 border border-white/15 bg-white/5 text-sm text-foreground placeholder:text-white/40 rounded-sm focus:outline-none focus:ring-2 focus:ring-white/10"
                        autoComplete="off"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2 hover:bg-white/10"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <Button variant="ghost" size="icon" className="hover:bg-white/10" onClick={handleSearchToggle}>
                    <Search className="h-5 w-5" />
                  </Button>
                )}
              </div>
              
              {/* User Authentication */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="hover:bg-white/10" asChild>
                    <Link href="/orders">
                      <Package className="h-4 w-4 mr-2" />
                      Orders
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-white/10" asChild>
                    <Link href="/account">
                      <User className="h-4 w-4 mr-2" />
                      {user?.name || user?.email}
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:bg-white/10" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="hover:bg-white/10" asChild>
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="border-white/20 bg-transparent text-foreground hover:bg-white/10" asChild>
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
              
              <CartSheet />
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Search Button */}
              <div className="relative">
                {isSearchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <input
                        id="mobile-navbar-search"
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 mobile-search-input border border-white/15 bg-white/5 text-sm text-foreground placeholder:text-white/40 rounded-sm focus:outline-none focus:ring-2 focus:ring-white/10"
                        autoComplete="off"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2 hover:bg-white/10"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <Button variant="ghost" size="icon" className="hover:bg-white/10" onClick={handleSearchToggle}>
                    <Search className="h-5 w-5" />
                  </Button>
                )}
              </div>
              
              {/* Cart for mobile */}
              <CartSheet />
              
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="border-white/20 bg-transparent text-foreground hover:bg-white/10">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] sm:w-[400px] overflow-y-auto bg-background border-white/10">
                  <div className="flex flex-col space-y-6 mt-6">
                    {/* Brand Logo in Mobile Menu */}
                    <div className="text-center border-b pb-4">
                      <span className="text-base font-light tracking-wide text-white/60">Menu</span>
                    </div>
                    
                    {/* Navigation Links */}
                    <div className="flex flex-col space-y-4">
                      <Link href="/" className="lookbook-kicker py-2 px-3 rounded-sm hover:bg-white/5 transition-colors">
                        Home
                      </Link>
                      <Link href="/products" className="lookbook-kicker py-2 px-3 rounded-sm hover:bg-white/5 transition-colors">
                        Products
                      </Link>
                      <Link href="/about" className="lookbook-kicker py-2 px-3 rounded-sm hover:bg-white/5 transition-colors">
                        About
                      </Link>
                      <Link href="/contact" className="lookbook-kicker py-2 px-3 rounded-sm hover:bg-white/5 transition-colors">
                        Contact
                      </Link>
                    </div>
                    
                    <Separator />
                    
                    {/* Mobile Search */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Search</h4>
                      <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                          <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-white/15 bg-white/5 text-sm text-foreground placeholder:text-white/40 rounded-sm focus:outline-none focus:ring-2 focus:ring-white/10"
                            autoComplete="off"
                          />
                        </div>
                        <Button type="submit" size="sm" variant="outline" className="border-white/20 bg-transparent text-foreground hover:bg-white/10">
                          Search
                        </Button>
                      </form>
                    </div>
                    
                    <Separator />
                    
                    {/* Mobile User Authentication */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Account</h4>
                      {isAuthenticated ? (
                        <div className="flex flex-col space-y-2">
                          <Button variant="ghost" asChild className="justify-start py-2 px-3 hover:bg-white/10">
                            <Link href="/orders">
                              <Package className="h-4 w-4 mr-3" />
                              My Orders
                            </Link>
                          </Button>
                          <Button variant="ghost" asChild className="justify-start py-2 px-3 hover:bg-white/10">
                            <Link href="/account">
                              <User className="h-4 w-4 mr-3" />
                              {user?.name || user?.email}
                            </Link>
                          </Button>
                          <Button variant="ghost" onClick={handleLogout} className="justify-start py-2 px-3 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign Out
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-2">
                          <Button variant="ghost" asChild className="justify-start py-2 px-3 hover:bg-white/10">
                            <Link href="/auth/signin">Sign In</Link>
                          </Button>
                          <Button variant="outline" asChild className="justify-start py-2 px-3 border-white/20 bg-transparent text-foreground hover:bg-white/10">
                            <Link href="/auth/signup">Sign Up</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            </>
          </div>
        </div>
      </nav>
  );
};

export default Navbar; 