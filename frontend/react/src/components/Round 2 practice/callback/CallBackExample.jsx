/*
use karo jab tm funciton ko prop k through child ko pass kar rahe ho
jab tm React.memo use kar rahe ho
jab expensive components unncessary re render ho rahe ho 
...
React.memo props compare karta ha k agar state same ha to re render mat karo
warna re render kar do child component ko b

when not to use:
har function pe hi laga do , that wrong

use callback khud bhi memory aur comparision cost rakhta ha 
to agar ye function same component me use ho raha h 
and child me nahi pass ho raha ha and 
expensive nahi ha to har jaga pe call back lagane ki zarorat nahi ha 


use call back memoizes a function. It returns the same function reference between renders unless one of its dependencies changes. its mainly used with React.memo or when passing callbacks to children components to avoid unncessary re renders.


*/