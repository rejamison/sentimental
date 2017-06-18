$fn = 40;

difference() {
    cylinder(h=7, d=103);
    translate([0,0,4]) cylinder(h=5, d=98.5);
    translate([0,0,-1]) cylinder(h=8, d=85);
}
translate([-5,-50,0]) cube([10,100,4]);
translate([-50,-5,0]) cube([100,10,4]);
difference() {
    union() {
        cylinder(h=104,d=10);
        translate([0,0,104]) sphere(d=40);
        translate([0,0,76]) cylinder(h=15, d1=10, d2=30);
    }
    translate([0,0,104]) rotate([0,0,0]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([45,0,0]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([45,0,45]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([45,0,90]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([45,0,135]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([45,0,180]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([45,0,225]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([45,0,270]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([45,0,315]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([90,0,0]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([90,0,45]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([90,0,90]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([90,0,135]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([90,0,180]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([90,0,225]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([90,0,270]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([90,0,315]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([135,0,0]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([135,0,45]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([135,0,90]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([135,0,135]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([135,0,180]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([135,0,225]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([135,0,270]) translate([0,0,10]) cylinder(d=3.6, h=25);
    translate([0,0,104]) rotate([135,0,315]) translate([0,0,10]) cylinder(d=3.6, h=25);
}
