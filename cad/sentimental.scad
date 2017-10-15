$fn = 200;

screw_width = 2.5;
BARREL_JACK_DIAMETER = 11;
AUDIO_JACK_DIAMETER = 6.1;
GLOBE_BASE_DIAMETER = 98.5;
ARMATURE_WIRE_DIAMETER = 3.6;

//exploded();
case();
//nucleus();

module exploded() {
    gap = 15;
    
    case();
    translate([48,15,55 + gap]) base();
    translate([48,15,55 + gap * 2]) nucleus();
    
    translate([48,15,55 - 2.5 + 104 + gap * 2]) {
        %sphere(d=200);
        rotate([0,0,0]) translate([-5,-2.5,45 + gap]) mount();
        for(a=[0:45:315]) {
            rotate([a,90,0]) translate([-5,-2.5,45 + gap]) mount();
            rotate([0,45,a]) translate([-5,-2.5,45 + gap]) mount();
            rotate([0,135,a]) translate([-5,-2.5,45 + gap]) mount();
        }
    }
}

module base() {
    difference() {
        cylinder(h=7, d=GLOBE_BASE_DIAMETER + 5);
        translate([0,0,4]) cylinder(h=5, d=GLOBE_BASE_DIAMETER);
        translate([0,0,-1]) cylinder(h=8, d=GLOBE_BASE_DIAMETER-8);
    }
    translate([-2.5,-(GLOBE_BASE_DIAMETER + 3)/2,0]) cube([5,GLOBE_BASE_DIAMETER + 3,4]);
    translate([-(GLOBE_BASE_DIAMETER + 3)/2,-2.5,0]) cube([GLOBE_BASE_DIAMETER + 3,5,4]);
    cylinder(h=11, d=8);
    cylinder(h=4, d=20);
}

module mount() {
    difference() {
        cube([10, 5, 5]);
        translate([5, 2.5, -1]) cylinder(d=3.5, h = 7);
    }
    translate([1, 2.5, 0]) cylinder(d=2, h = 7);
    translate([9, 2.5, 0]) cylinder(d=2, h = 7);
}

module nucleus() {
    difference() {
        union() {
            // sphere
            translate([0,0,4]) cylinder(h=100,d=10);
            translate([0,0,104]) sphere(d=40);
            
            // avoid overhangs > 45deg
            translate([0,0,74]) cylinder(h=20, d1=10, d2=34.6);
            
            // widened base to make it easier to print
            translate([0,0,4]) cylinder(h=10, d1=20, d2=10);
        }
        
        // armature wire holes
        translate([0,0,104]) rotate([0,0,0]) translate([0,0,10]) cylinder(d=ARMATURE_WIRE_DIAMETER, h=25);
        for(a=[0:45:315]) {
            translate([0,0,104]) rotate([45,0,a]) translate([0,0,10]) cylinder(d=ARMATURE_WIRE_DIAMETER, h=25);
            translate([0,0,104]) rotate([90,0,a]) translate([0,0,10]) cylinder(d=ARMATURE_WIRE_DIAMETER, h=25);
            translate([0,0,104]) rotate([135,0,a]) translate([0,0,10]) cylinder(d=ARMATURE_WIRE_DIAMETER - .1, h=25);
        }
    }
}

module case() {
    //////////////////////////////////////////////////
    // Shell
    //////////////////////////////////////////////////
    translate([48,15,0]) difference() {
        union() {
            cylinder(h=60, d1=150, d2=GLOBE_BASE_DIAMETER + 8);
            
            // flatten out the surface the jacks are mounted to.
            rotate([0,0,10]) translate([63,0,12]) rotate([0,69.5,0]) cylinder(h=7.5, d=15);
            rotate([0,0,-10]) translate([63,0,12]) rotate([0,69.5,0]) cylinder(h=7.5, d=15);
        }
        translate([0,0,1]) cylinder(h=60, d1=146,d2=GLOBE_BASE_DIAMETER - 8);
        translate([0,0,55]) cylinder(h=6, d=GLOBE_BASE_DIAMETER + 5);
        
        // jacks
        rotate([0,0,10]) translate([61,0,12]) rotate([0,69.5,0]) cylinder(h=7.5, d=13);
        rotate([0,0,10]) translate([62,0,12]) rotate([0,69.5,0]) cylinder(h=100, d=BARREL_JACK_DIAMETER);
        rotate([0,0,-10]) translate([61,0,12]) rotate([0,69.5,0]) cylinder(h=7.5, d=13);
        rotate([0,0,-10]) translate([62,0,12]) rotate([0,69.5,0]) cylinder(h=100, d=AUDIO_JACK_DIAMETER);
        
        // slots
        rotate([0,0,0]) translate([50,-0.5,27]) cube([25,1,25]);
        rotate([0,0,10]) translate([50,-0.5,27]) cube([25,1,25]);
        rotate([0,0,5]) translate([50,-0.5,27]) cube([25,1,25]);
        rotate([0,0,-5]) translate([50,-0.5,27]) cube([25,1,25]);
        rotate([0,0,-10]) translate([50,-0.5,27]) cube([25,1,25]);
        rotate([0,0,190]) translate([50,-0.5,27]) cube([25,1,25]);
        rotate([0,0,180]) translate([53,-0.5,27]) cube([25,1,25]);
        rotate([0,0,185]) translate([53,-0.5,27]) cube([25,1,25]);
        rotate([0,0,175]) translate([53,-0.5,27]) cube([25,1,25]);
        rotate([0,0,170]) translate([50,-0.5,27]) cube([25,1,25]);
        
        // notch for electret mic module
        translate([-51,-7.1,55-26]) {
            cube([8,14.2,26.1]);
            translate([0,0,23]) rotate([0,45,0]) translate([-1,0,-1]) cube([2,14.2,2]);
        }
        
        // cut out some of the bottom to make things easier to get off the build plate
        w = .8;
        for(i=[-13.5:1:13.5]) {
            l = sqrt(1 - ((i/14) * (i/14))) * 140;
            translate([0,i*5,0]) rotate([45,0,0]) translate([-l/2,-w/2,-w/2]) cube([l,w,w]);
        }
    }

    // Raspberry PI mount
    translate([0,0,1]) {
        difference() {
            cylinder(h=8, d=screw_width + 1.5);
            translate([0,0,0]) cylinder(h=12, d=screw_width);
        }
        translate([58,0,0]) difference() {
            cylinder(h=8, d=screw_width + 1.5);
            translate([0,0,0]) cylinder(h=12, d=screw_width);
        }
        translate([58,49,0]) difference() {
            cylinder(h=8, d=screw_width + 1.5);
            translate([0,0,0]) cylinder(h=12, d=screw_width);
        }
        translate([0,49,0]) difference() {
            cylinder(h=8, d=screw_width + 1.5);
            translate([0,0,0]) cylinder(h=12, d=screw_width);
        }
    }
    
    // Fadecandy mount
    translate([15,-35,1]) difference() {
        cube([41,23,8]);
        translate([1,1,4]) cube([39,21,8]);
        translate([-1,3,0]) cube([43,17,10]);
    }
    translate([51,-13,9]) rotate([90,90,0]) prism(5, 3, 2);
    translate([56,-34,9]) rotate([-90,90,0]) prism(5, 3, 2);
}

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
