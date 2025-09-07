export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Layout admin complètement indépendant */}
      {children}
    </div>
  )
}