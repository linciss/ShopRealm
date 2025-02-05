export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='w-full py-12 md:py-24 lg:py-32'>
      <div className='container px-4 md:px-6 place-content-center flex'>
        {children}
      </div>
    </section>
  );
}
