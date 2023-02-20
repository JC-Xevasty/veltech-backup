import StoryImage from "../../../assets/home/Story-Image.png"

function Story() {
  return (
    <div className="flex flex-col items-start gap-y-5 w-full px-10 lg:px-36 py-20 lg:pb-28">
      <span className="text-lg text-primary font-grandview-bold">Setting a global standard in safety and security solutions.</span>
    
      <p className="text-5xl text-accent font-grandview-bold">Provide High Performance Services for multiple industries and Technologies!</p>

      <div className="flex flex-col lg:grid lg:grid-cols-9 gap-x-20 mt-10">
        <div className="lg:col-start-1 lg:col-end-5 hidden lg:block">
          <div className="relative">
            <img className="w-4/5" src={ StoryImage } alt="Story" />
            <div className="absolute right-0 top-40 bg-accent w-[350px] px-10 py-14">
              <h1 className="text-xl text-white font-grandview-bold border-l-2 border-l-white pl-5">
                Latest solutions and decades of experience tested by time
              </h1>
            </div>
          </div>
        </div>

        <div className="lg:col-start-5 lg:col-end-10 flex flex-col gap-y-6">
          <p className="text-xl text-accent font-grandview-bold">Veltech is a long-running Security and Safety Solutions Company that provides a broad range of services to commercial and industry businesses all over the world.</p>
          <p className="text-[#0B2653BB]">The world is evolving quicker than ever before, including safety precautions. Veltech is designed to deliver the finest possible services to the many sections of society. You are helping to lead the charge; we can assist you in building on your previous triumphs and planning for the future.</p>
        
          <div className="flex flex-col gap-y-2.5">
            {
              [
                "Quality Control, 100% Satisfaction Guarantee",
                "Unrivaled workmanship, Professional and Qualified",
                "Environmental Sensitivity, Tailored-fit Solutions"
              ].map((feature, index) => (
                <div className="flex items-center gap-x-5" key={ `feature-${ index }` }>
                  <div className="bg-primary w-[12.5px] h-[3px]" />
                  <h1 className="font-grandview-bold">{ feature }</h1>
                </div>
              ))
            }
          </div>

          <span><span className="font-grandview-bold">Merle Velasco</span>, General Manager</span>
        </div>
      </div>

      {/* <div className="flex items-start w-full mt-16">
        <div className="ml-auto flex flex-col gap-y-5 text-end font-grandview-bold max-w-[30ch]">
          <span className="text-5xl">250</span>
          <span>Projects completed in the last 5 years.</span>
        </div>

        <div className="bg-accent w-[1px] h-[50px] mx-14 my-auto" />

        <div className="mr-auto flex flex-col gap-y-5 font-grandview-bold max-w-[30ch]">
          <span className="text-5xl">1,104</span>
          <span>Happy customers who trusted us.</span>
        </div>
      </div> */}
    </div>
  )
}

export default Story