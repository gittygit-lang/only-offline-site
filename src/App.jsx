import sadpage from './sadpage.svg'

function App() {
  return (
    <main className="min-h-screen bg-[#202124] px-8 text-[#bdc1c6] pt-30">
      <section className="mx-auto w-full max-w-133">
        <img
          className="mb-11 block h-10.5 w-8.5 opacity-[0.72] max-sm:mb-9.5"
          src={sadpage}
          alt=""
        />
        <h1 className="mb-1 text-[22px] font-normal" id="offline-title">
          This site can't be reached right now.
        </h1>
        <p className="mt-2 text-[15px]">
          Try disabling your network connection and reloading the page.
        </p>
        <div className="mt-13 flex justify-end max-sm:mt-10">
          <button
            className="min-h-8 cursor-pointer rounded-full border-0 bg-blue-700 px-3 text-[13px] text-white hover:bg-blue-500"
            type="button"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
