import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '@/db/config'; // Adjust the path to your database connection file
import District from '@/models/District'; // Adjust the path to your District model

export async function POST(request: NextRequest) {
  try {
    // Ensure database connection
    await connectDB();

    // Parse the request body
    const districts = await request.json();

    // Insert multiple districts
    const insertedDistricts = await District.insertMany(districts);

    return NextResponse.json({
      message: 'Districts inserted successfully',
      count: insertedDistricts.length
    }, { status: 201 });
  } catch (error) {
    console.error('Error inserting districts:', error);
    return NextResponse.json({
      message: 'Failed to insert districts',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     // Ensure database connection
//     await connectDB();

//     // Fetch all districts, selecting only the district name
//     const districts = await District.find({}, { district: 1, _id: 1 }).sort({ district: 1 });

//     // Return the districts
//     return NextResponse.json(districts, { status: 200 });
//   } catch (error) {
//     console.error('Districts fetch error:', error);
    
//     return NextResponse.json(
//       { message: 'Failed to fetch districts', error: (error as Error).message }, 
//       { status: 500 }
//     );
//   }
// }

export async function GET(request: NextRequest) {
  try {
    // Ensure database connection
    await connectDB();

    // Fetch all districts with full details
    const districts = await District.find({}, {
      district: 1,
      phosphorus_level_ug_per_g: 1,
      ph_value:1,
      nitrogen_level_percent: 1,
      potassium_level_ug_per_g: 1,
      average_rainfall: 1
    }).sort({ district: 1 });

    // Return the districts
    return NextResponse.json(districts, { status: 200 });
  } catch (error) {
    console.error('Districts fetch error:', error);
    
    return NextResponse.json(
      { message: 'Failed to fetch districts', error: (error as Error).message }, 
      { status: 500 }
    );
  }
}