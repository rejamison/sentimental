$fn = 40;

difference() {
    union() {
        translate([0,0,4]) cylinder(h=100,d=10);
        translate([0,0,104]) sphere(d=40);
        translate([0,0,74]) cylinder(h=20, d1=10, d2=34);
        translate([0,0,4]) cylinder(h=10, d1=20, d2=10);
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
    translate([0,0,104]) rotate([135,0,0]) translate([0,0,10]) cylinder(d=3.5, h=25);
    translate([0,0,104]) rotate([135,0,45]) translate([0,0,10]) cylinder(d=3.5, h=25);
    translate([0,0,104]) rotate([135,0,90]) translate([0,0,10]) cylinder(d=3.5, h=25);
    translate([0,0,104]) rotate([135,0,135]) translate([0,0,10]) cylinder(d=3.5, h=25);
    translate([0,0,104]) rotate([135,0,180]) translate([0,0,10]) cylinder(d=3.5, h=25);
    translate([0,0,104]) rotate([135,0,225]) translate([0,0,10]) cylinder(d=3.5, h=25);
    translate([0,0,104]) rotate([135,0,270]) translate([0,0,10]) cylinder(d=3.5, h=25);
    translate([0,0,104]) rotate([135,0,315]) translate([0,0,10]) cylinder(d=3.5, h=25);
    cylinder(h=15, d=8.1);
}
