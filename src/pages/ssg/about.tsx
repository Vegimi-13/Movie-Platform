import type { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps<{
  generatedAt: string;
}> = async () => {
  return {
    props: {
      generatedAt: new Date().toISOString(),
    },
  };
};

export default function SsgAboutPage({ generatedAt }: { generatedAt: string }) {
  return (
    <main className="shell py-12">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f5b84b]">
        SSG example
      </p>
      <h1 className="mt-2 text-4xl font-black">Static project summary</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-[#d7d9de]">
        CineScope is a Next.js and MongoDB movie platform with authentication,
        role-based admin access, CRUD, reusable components, and responsive
        Tailwind styling.
      </p>
      <p className="mt-6 text-sm text-[#a7adba]">Generated at {generatedAt}</p>
    </main>
  );
}
