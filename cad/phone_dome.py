"""Ribbed dome desk holder for an iPhone on a MagSafe puck.

A sphere truncated flat at the bottom (prints base-down, no supports) and cut by a
tilted plane. The plane carries a pocket for the puck; the cord drops through an internal
passage and leaves the back of the base at desk level.

Plain build123d, units mm, +Z up, the phone faces -Y. Run to write STEP and STL:
    python phone_dome.py
Assumed: puck 56 mm x 5.5 mm (check yours), 0.4 mm clearance per side; it sits
0.55 mm proud of the face. Cable hole 11 x 7 mm.
"""
import math
from pathlib import Path

import build123d as bd

R = 50.0            # dome radius
CZ = 34.0           # sphere centre height; base cut flat at z=0 (base radius ~36.7)
TILT = 38.0         # puck face angle from horizontal, degrees
D = 30.0            # puck plane distance from sphere centre (face circle radius 40)
PUCK_D, PUCK_T = 56.0, 5.5
SEAT = 0.9          # pocket depth as a fraction of the puck: it stands 10% proud of the
                    # face, so the phone meets the puck and not the rim around it
CLEAR = 0.4
HOLE = (11.0, 7.0)  # cable hole, wide x thick: what the plug head is fed through
PASS_L, PASS_W = HOLE         # internal passage (radial x across)
PASS_R = 23.0       # passage centre, mm uphill of the puck centre along the face
TUN_W, TUN_H = HOLE[0], HOLE[1] + HOLE[0] / 2  # tunnel to the back: 11 wide, 7 to the gable
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
    depth = SEAT * PUCK_T
    body -= plane.location * bd.Pos(0, 0, -depth) * bd.Cylinder(
        pocket_d / 2, depth + 1, align=(bd.Align.CENTER, bd.Align.CENTER, TOP))

    # internal cord run. Turn the puck so its cable points uphill (to the back): the
    # cable leaves the puck's edge straight into a passage under the face, drops
    # through the dome and leaves the back at desk level. The passage is sized for the
    # USB-C plug to be fed down it from the top, then out through the tunnel under
    # the base, which is open to the desk and also big enough for the plug.
    # From outside only the slot beside the puck (hidden by the phone) and the small rear exit show.
    p = origin + u * PASS_R
    top = p.Z + 10
    passage = bd.extrude(bd.SlotOverall(PASS_L, PASS_W, rotation=90), amount=top)
    body -= bd.Pos(p.X, p.Y, 0) * passage
    # tunnel to the back, open to the desk; its roof is a 45-degree gable, not a flat
    # bridge, so it prints without support
    half, wall = TUN_W / 2, TUN_H - TUN_W / 2
    gable = bd.Polygon((-half, 0), (half, 0), (half, wall), (0, TUN_H), (-half, wall), align=None)
    tunnel = bd.extrude(bd.Plane.XZ * gable, amount=R + 5)   # Plane.XZ extrudes toward -Y
    body -= bd.Pos(0, p.Y, 0) * bd.Rot(0, 0, 180) * tunnel
    assert (TUN_W, wall) == HOLE   # the tunnel's opening is the hole, full height at its sides

    # the passage opens under the puck, and beyond its edge by only a few mm
    face_r = (p.Y + PASS_L / 2 - origin.Y) / u.Y
    assert PUCK_D / 2 + CLEAR < face_r < PUCK_D / 2 + 7, face_r

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
