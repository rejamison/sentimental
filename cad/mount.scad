$fn = 10;

difference() {
    cube([10, 5, 5]);
    translate([5, 2.5, -1]) cylinder(d=3.5, h = 7);
}
translate([1, 2.5, 0]) cylinder(d=2, h = 7);
translate([9, 2.5, 0]) cylinder(d=2, h = 7);