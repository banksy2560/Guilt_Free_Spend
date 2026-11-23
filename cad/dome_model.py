"""text-to-cad model of the dome holder, FDM printed (PLA/PETG) on a Bambu Lab X2D.

Check: cad model dfm "$ID" --process printing --technology fdm --layer-height 0.2 --nozzle 0.4
"""
from cad import model

import phone_dome


@model
def phone_dome_holder():
    return phone_dome.build()


if __name__ == "__main__":
    phone_dome_holder()
