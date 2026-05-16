import React, { useState } from "react";
import Sign from "./sing";
function Signup({signup,setsignup}) {
 return(
    <>
    {(signup)?<Sign setsignup={setsignup} />:null}
    </>
 );
}

export default Signup;
