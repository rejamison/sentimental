$fn = 40;

difference() {
    cylinder(h=7, d=103);
    translate([0,0,4]) cylinder(h=5, d=98.5);
    translate([0,0,-1]) cylinder(h=8, d=90);
}
translate([-2.5,-50,0]) cube([5,100,4]);
translate([-50,-2.5,0]) cube([100,5,4]);
cylinder(h=11, d=8);
cylinder(h=4, d=20);