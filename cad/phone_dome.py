"""Ribbed dome desk holder for an iPhone on a MagSafe puck.

A sphere truncated flat at the bottom (prints base-down, no supports) and cut by a
tilted plane. The plane carries a pocket for the puck; the cord drops through a hole
and leaves the back of the base through a slot.

Plain build123d, units mm, +Z up, the phone faces -Y. Run to write STEP and STL:
    python phone_dome.py
Assumed: puck 56 mm x 5.5 mm (check yours), 0.4 mm clearance per side.
"""
import math
from pathlib import Path

import build123d as bd

R = 50.0            # dome radius
CZ = 34.0           # sphere centre height; base cut flat at z=0 (base radius ~36.7)
TILT = 38.0         # puck face angle from horizontal, degrees
D = 30.0            # puck plane distance from sphere centre (face circle radius 40)
PUCK_D, PUCK_T = 56.0, 5.5
CLEAR = 0.4
CORD_HOLE = 7.0     # vertical cord hole diameter
CORD_SLOT = 5.0     # slot width under the base
RIBS, RIB_W, RIB_DEPTH = 72, 1.6, 1.2
BIG = 4 * R
TOP = bd.Align.MIN


def build():
    a = math.radians(TILT)
    n = bd.Vector(0, -math.sin(a), math.cos(a))     # face normal, leans toward the phone
    u = bd.Vector(0, math.cos(a), math.sin(a))      # uphill within the face
    c = bd.Vector(0, 0, CZ)
    origin = c + n * D
    plane = bd.Plane(origin=origin, x_dir=(1, 0, 0), z_dir=n)

    # sphere, flat base at z=0
    body = bd.Pos(0, 0, CZ) * bd.Sphere(R)
    body &= bd.Box(BIG, BIG, BIG, align=(bd.Align.CENTER, bd.Align.CENTER, TOP))

    # meridian ribs: a comb of 72 thin planar boxes (cheap to fuse), trimmed once to a
    # skin of the sphere, then cut from the body in one boolean
    box = bd.Box(R + 2 - 20, RIB_W, BIG, align=(TOP, bd.Align.CENTER, bd.Align.CENTER))
    box = bd.Pos(20, 0, CZ) * box
    comb = bd.Compound([bd.Rot(0, 0, i * 360 / RIBS) * box for i in range(RIBS)])
    skin = bd.Pos(0, 0, CZ) * (bd.Sphere(R + 1) - bd.Sphere(R - RIB_DEPTH))
    body -= (skin & comb)

    # tilted face (cut everything in front of the plane), then the puck pocket
    body -= plane.location * bd.Box(BIG, BIG, BIG, align=(bd.Align.CENTER, bd.Align.CENTER, TOP))
    pocket_d = PUCK_D + 2 * CLEAR
    body -= plane.location * bd.Pos(0, 0, -(PUCK_T + 0.3)) * bd.Cylinder(
        pocket_d / 2, PUCK_T + 1, align=(bd.Align.CENTER, bd.Align.CENTER, TOP))

    # cord: vertical hole from the pocket's uphill edge to the base, slot to the back
    q = origin + u * (PUCK_D / 2 - CORD_HOLE / 2 - 1)
    body -= bd.Pos(q.X, q.Y, 0) * bd.Cylinder(CORD_HOLE / 2, q.Z + 5, align=(bd.Align.CENTER, bd.Align.CENTER, TOP))
    body -= bd.Pos(0, (q.Y + R) / 2, 0) * bd.Box(
        CORD_SLOT, R - q.Y, 5, align=(bd.Align.CENTER, bd.Align.CENTER, TOP))

    body.label = "phone_dome"
    body.color = "#cdb89a"
    return body


if __name__ == "__main__":
    part = build()
    bb = part.bounding_box()
    print("valid", part.is_valid, "solids", len(part.solids()))
    print("size", round(bb.size.X, 1), round(bb.size.Y, 1), round(bb.size.Z, 1), "zmin", round(bb.min.Z, 3))
    print("volume cm3", round(part.volume / 1000, 1))
    out = Path(__file__).parent
    bd.export_step(part, str(out / "phone_dome.step"))
    bd.export_stl(part, str(out / "phone_dome.stl"), tolerance=0.02, angular_tolerance=0.1)
