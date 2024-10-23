import Link from "next/link";
export default function Home() {
  return (
    <div className="container mx-auto">
      <section className="bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl font-extrabold sm:text-5xl">
              Welcome to Polly
              <strong className="font-extrabold text-blue-700 sm:block">
                {" "}
                Participate in Exiting Polls.{" "}
              </strong>
            </h1>

            <p className="mt-4 sm:text-xl/relaxed">
              Advanced polling system that allows you to create and participate
              secublue with webauthn.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                className="block w-full rounded bg-blue-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
                href="/login"
              >
                Login
              </Link>

              <Link
                className="block w-full rounded px-12 py-3 text-sm font-medium text-blue-600 shadow hover:text-blue-700 focus:outline-none focus:ring active:text-blue-500 sm:w-auto"
                href="/register"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
