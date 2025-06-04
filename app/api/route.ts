import { NextResponse } from "next/server";

export async function GET(){
    try {
       return NextResponse.json(
        {message: 'HELLO FROM SNAPWALL API'},
        {status: 200}
    )
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            {message: "Error"},
            {status: 500}
        )
    }
}