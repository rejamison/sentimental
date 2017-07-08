$fn=50;
screw_width = 2.5;

//////////////////////////////////////////////////
// Shell
//////////////////////////////////////////////////
translate([48,15,0]) difference() {
    union() {
        cylinder(h=60, d1=150, d2=105);
        translate([63,0,12]) rotate([0,69.5,0]) cylinder(h=7.5, d=20);
        //translate([63,-7.5,0]) cube([10,15,20]);
    }
    translate([0,0,1]) cylinder(h=60, d1=146,d2=90);
    translate([0,0,55]) cylinder(h=6, d=103.5);
    translate([61,0,12]) rotate([0,69.5,0]) cylinder(h=7.5, d=16);
    translate([62,0,12]) rotate([0,69.5,0]) cylinder(h=100, d=6);
    rotate([0,0,0]) translate([55,-0.5,27]) cube([20,1,25]);
    rotate([0,0,10]) translate([55,-0.5,27]) cube([20,1,25]);
    rotate([0,0,5]) translate([55,-0.5,27]) cube([20,1,25]);
    rotate([0,0,-5]) translate([55,-0.5,27]) cube([20,1,25]);
    rotate([0,0,-10]) translate([55,-0.5,27]) cube([20,1,25]);
    rotate([0,0,190]) translate([55,-0.5,27]) cube([20,1,25]);
    rotate([0,0,180]) translate([55,-0.5,27]) cube([20,1,25]);
    rotate([0,0,185]) translate([55,-0.5,27]) cube([20,1,25]);
    rotate([0,0,175]) translate([55,-0.5,27]) cube([20,1,25]);
    rotate([0,0,170]) translate([55,-0.5,27]) cube([20,1,25]);
}

//////////////////////////////////////////////////
// Raspberry PI mount
//////////////////////////////////////////////////
difference() {
    cylinder(h=10, d=screw_width + 1.5);
    translate([0,0,-1]) cylinder(h=12, d=screw_width);
}
translate([58,0,0]) difference() {
    cylinder(h=10, d=screw_width + 1.5);
    translate([0,0,-1]) cylinder(h=12, d=screw_width);
}
translate([58,49,0]) difference() {
    cylinder(h=10, d=screw_width + 1.5);
    translate([0,0,-1]) cylinder(h=12, d=screw_width);
}
translate([0,49,0]) difference() {
    cylinder(h=10, d=screw_width + 1.5);
    translate([0,0,-1]) cylinder(h=12, d=screw_width);
}

//////////////////////////////////////////////////
// Fadecandy mount
//////////////////////////////////////////////////
translate([15,-35,0]) difference() {
    cube([41,23,10]);
    translate([1,1,6]) cube([39,21,10]);
    translate([-1,3,-1]) cube([43,17,12]);
}
translate([15,-13,10]) rotate([90,90,0]) prism(5, 3, 2);
translate([51,-13,10]) rotate([90,90,0]) prism(5, 3, 2);
translate([20,-34,10]) rotate([-90,90,0]) prism(5, 3, 2);
translate([56,-34,10]) rotate([-90,90,0]) prism(5, 3, 2);



//////////////////////////////////////////////////
// Draw a rectangular prism
//////////////////////////////////////////////////
module prism(l, w, h) {
       polyhedron(points=[
               [0,0,h],           // 0    front top corner
               [0,0,0],[w,0,0],   // 1, 2 front left & right bottom corners
               [0,l,h],           // 3    back top corner
               [0,l,0],[w,l,0]    // 4, 5 back left & right bottom corners
       ], faces=[ // points for all faces must be ordered clockwise when looking in
               [0,2,1],    // top face
               [3,4,5],    // base face
               [0,1,4,3],  // h face
               [1,2,5,4],  // w face
               [0,3,5,2],  // hypotenuse face
       ]);
}
