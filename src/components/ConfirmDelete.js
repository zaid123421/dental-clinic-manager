// import images
import deleteConfirm from "../assets/deleteConfirm.jpg"

export default function ConfirmDelete({ name, onClick1, onClick2 }) {
  return(
    <div className="font-semibold fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
      <div className="bg-white rounded-xl p-5 text-xl flex flex-col items-center shadow-xl w-[400px]">
        <img alt="image_delete" src={deleteConfirm} className="w-[200px]"/>
        <p className="my-5 text-center">
          Do You Really Want To Delete {name}?
        </p>
        <div className="flex justify-center w-full">
          <button onClick={onClick1} className="w-[85px] bg-[#9e9e9e] border-2 border-[#9e9e9e] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300">Cancel</button>
          <button onClick={onClick2} className="w-[85px] bg-[#DD1015] border-2 border-[#DD1015] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300 ml-7">Delete</button>
        </div>
      </div>
    </div>
  );
}