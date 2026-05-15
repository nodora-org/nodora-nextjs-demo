import CartForm from "@/app/components/CartForm";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 dark:bg-black font-sans">
      <CartForm />
    </div>
  );
}
