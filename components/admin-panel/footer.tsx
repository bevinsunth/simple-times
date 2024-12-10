import Link from 'next/link';

export function Footer() {
  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 z-20 w-full p-3 shadow backdrop-blur">
      <div className="mx-4 flex h-14 items-center md:mx-8">
        <p className="text-muted-foreground text-left text-xs leading-loose md:text-sm">
          Built using{' '}
          <Link
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            shadcn/ui
          </Link>
          <br />
          Sidebar template from{' '}
          <Link
            href="https://github.com/salimi-my/shadcn-ui-sidebar"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            salimi-my
          </Link>
          <br />
          Check out my portfolio at{' '}
          <Link
            href="https://bevthe.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            bevthe.dev
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
