# How to run locally
Only tested on google chrome, but it, at least, complains about cross origin requests when getting the shaders via XMLHttpRequest over the file:// protocol. Just start a simple web server to serve index.html to get around it. If you have Python installed you can use the supplied run script like this.
```bash
$ sh python_server.sh
```

# Shading
TODO: explain basic stuff like rendering equation, brdf, etc

## Rendering Equation


# Physical Based Rendering
Implementation of (some techniques of) Physical Based Rendering (PBR) in WebGL.

PBR is based around the theory that explains how light acts on different materials in the physical world. This leads materials shaded by PBR techniques looking more realistic than other shading techniques like Phong shading under any lighting condition. This also means that the artists' job is easier since materials don't have to be tweaked for different lighting conditions to always look good.

## How it works
PBR basically models three things
* Microfacet surfaces
* Energy conservation
* TODO

### Microfacet surfaces
Surfaces in the real world are not perfectly smooth and thus modeling them as such will not look completely right when letting light bounce of it. Instead surfaces consists of microsurfaces whose alignment is the roughness of the surface. Higher roughness means that the microfacets are assumed to be very unaligned and vice versa. These microfacets cause incoming light to scatter in many different directions which in turn makes reflections on the surface more widespread.

However, since modeling these microfacets explicitly would be infeasible the light scattering is handled statistically given the roughness parameter. TODO

### Energy Conservation
Outgoing light energy should not be greater than the incoming light energy.

Usually a distinction is made between specular and diffuse light. Specular light is light that is directly reflected on a surface. Diffuse light is light that has first refracted into the material being hit and then scattered around inside the material until it either loses all its energy or leaves the material again. Light leaving the material again in this manner is called diffuse light and contribute to the diffuse color of the surface.

The sum of the fraction specular light and fraction of diffuse light must equal 1 to maintain the energy conservation.

### Materials
Two basic types of materials in PBR are metals and non-metals (dielectric). Refracted light in metal surfaces is completely absorbed and thus does not contribute to the diffuse color (metals show no diffuse color). Non-metals have the diffuse color as described above.

## Reflectance Equation
$L_o(p, \omega_o) = \int_\Omega f_r(p, \omega_i, \omega_o) L_i(p, \omega_i) n \omega_i d\omega_i$

L is **radiance** which is a quantification of the magnitude of light from a single direction or the total observed energy over an area scaled by incident angle. It's equation includes the following things

* **Radiant flux** $\Phi$ is the transmitted energy of a light source. This incorporates the emitted energy at all its wavelengths.

* **Solid angle** $\omega$ TODO

* **Radiant intensity** is the amount of radiant flux per solid angle which is the strength of a light source over an area defined by the solid angle

**Irradiance** is all the incoming light on a point which is the sum of all radiance which is what the fragment shader needs to set the right color.

### Bidirectional reflective distribution function (BRDF)
The BRDF takes an incoming light direction $\omega_i$, outgoing view direction $\omega_o$, surface normal and roughness parameter and returns the total reflected light
