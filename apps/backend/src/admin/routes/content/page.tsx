import { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DocumentText } from "@medusajs/icons"
import {
  Container,
  Heading,
  Text,
  Input,
  Textarea,
  Switch,
  Button,
  Badge,
  Tabs,
  Label,
  toast,
  Toaster,
} from "@medusajs/ui"

type ContentItemState = {
  key: string
  section: string
  title: string
  subtitle: string
  body: string
  image_url: string
  link_url: string
  link_text: string
  is_active: boolean
  metadata: Record<string, unknown>
}

const DEFAULT_ITEMS: Record<string, ContentItemState> = {
  hero: {
    key: "hero",
    section: "home",
    title: "Artisanally Crafted.\nAuthentically Brewed.",
    subtitle: "FEATURED DRAFT",
    body: "Deep roots, slow pours, and a relentless pursuit of the perfect pint. We brew for the connoisseur who values the story behind the glass as much as the liquid within.",
    image_url: "",
    link_url: "#",
    link_text: "Go to shop",
    is_active: true,
    metadata: {
      secondary_cta: "See our beers",
    },
  },
  banner: {
    key: "banner",
    section: "home",
    title: "¡NUEVA EDICIÓN LIMITADA! Prueba nuestra nueva IPA lupulada en frío.",
    subtitle: "",
    body: "",
    image_url: "",
    link_url: "/shop",
    link_text: "Ver en tienda",
    is_active: true,
    metadata: {},
  },
  event: {
    key: "event",
    section: "events",
    title: "Cata de Cervezas & Tap Takeover",
    subtitle: "Viernes 27 Septiembre · 20:00h",
    body: "Ven a probar nuestras últimas elaboraciones en barril acompañadas de maridaje artesanal.",
    image_url: "https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=1000&q=80",
    link_url: "#",
    link_text: "Reservar plaza",
    is_active: true,
    metadata: {
      location: "Taproom Panda Beer, Madrid",
    },
  },
  instagram: {
    key: "instagram",
    section: "social",
    title: "Momento Panda en directo",
    subtitle: "@pandabeer.es",
    body: "Nueva remesa lista para embotellar. Fresca, sin filtrar y con toda la intensidad del lúpulo.",
    image_url: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=1000&q=80",
    link_url: "https://instagram.com/pandabeer",
    link_text: "Ver en Instagram",
    is_active: true,
    metadata: {},
  },
}

const ContentAdminPage = () => {
  const [items, setItems] = useState<Record<string, ContentItemState>>(DEFAULT_ITEMS)
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch("/admin/content", {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          if (data.content && Array.isArray(data.content)) {
            const mapped = { ...DEFAULT_ITEMS }
            for (const it of data.content) {
              if (it.key) {
                mapped[it.key] = {
                  key: it.key,
                  section: it.section || "general",
                  title: it.title || "",
                  subtitle: it.subtitle || "",
                  body: it.body || "",
                  image_url: it.image_url || "",
                  link_url: it.link_url || "",
                  link_text: it.link_text || "",
                  is_active: it.is_active ?? true,
                  metadata: it.metadata || {},
                }
              }
            }
            setItems(mapped)
          }
        }
      } catch (err) {
        console.error("Failed to load content items", err)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  const handleChange = (key: string, field: keyof ContentItemState, value: unknown) => {
    setItems((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }))
  }

  const handleMetadataChange = (key: string, metaKey: string, value: string) => {
    setItems((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        metadata: {
          ...prev[key].metadata,
          [metaKey]: value,
        },
      },
    }))
  }

  const saveItem = async (key: string) => {
    setSavingKey(key)
    try {
      const itemToSave = items[key]
      const res = await fetch(`/admin/content/${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(itemToSave),
      })

      if (res.ok) {
        toast.success("Contenido guardado", {
          description: `El bloque '${key}' se ha actualizado en la base de datos.`,
        })
      } else {
        const err = await res.json()
        toast.error("Error al guardar", {
          description: err.message || "No se pudo actualizar el contenido.",
        })
      }
    } catch (e) {
      toast.error("Error de conexión", {
        description: "Comprueba que el backend esté operativo.",
      })
    } finally {
      setSavingKey(null)
    }
  }

  if (loading) {
    return (
      <Container className="p-8">
        <Heading level="h1">Cargando contenidos...</Heading>
      </Container>
    )
  }

  return (
    <div className="flex flex-col gap-y-4 p-8">
      <Toaster />
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h1">Gestor de Contenidos (CMS)</Heading>
          <Text className="text-ui-fg-subtle">
            Modifica textos, banners, eventos y enlaces destacados que se muestran en el storefront sin necesidad de redesplegar.
          </Text>
        </div>
        <Badge color="green">Medusa v2 Content Module</Badge>
      </div>

      <Tabs defaultValue="hero">
        <Tabs.List>
          <Tabs.Trigger value="hero">Hero Principal</Tabs.Trigger>
          <Tabs.Trigger value="banner">Banner de Aviso</Tabs.Trigger>
          <Tabs.Trigger value="event">Próximo Evento</Tabs.Trigger>
          <Tabs.Trigger value="instagram">Instagram Destacado</Tabs.Trigger>
        </Tabs.List>

        {/* HERO TAB */}
        <Tabs.Content value="hero" className="mt-4">
          <Container className="flex flex-col gap-y-4 p-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <Heading level="h2">Copia del Hero</Heading>
                <Text className="text-ui-fg-subtle">Textos principales de la cabecera de la página.</Text>
              </div>
              <Button
                variant="primary"
                onClick={() => saveItem("hero")}
                isLoading={savingKey === "hero"}
              >
                Guardar Hero
              </Button>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="hero-subtitle">Antetítulo (Eyebrow)</Label>
                <Input
                  id="hero-subtitle"
                  value={items.hero.subtitle}
                  onChange={(e) => handleChange("hero", "subtitle", e.target.value)}
                  placeholder="FEATURED DRAFT"
                />
              </div>

              <div>
                <Label htmlFor="hero-title">Titular Principal (soporta saltos de línea)</Label>
                <Textarea
                  id="hero-title"
                  rows={2}
                  value={items.hero.title}
                  onChange={(e) => handleChange("hero", "title", e.target.value)}
                  placeholder="Artisanally Crafted.&#10;Authentically Brewed."
                />
              </div>

              <div>
                <Label htmlFor="hero-body">Texto descriptivo</Label>
                <Textarea
                  id="hero-body"
                  rows={3}
                  value={items.hero.body}
                  onChange={(e) => handleChange("hero", "body", e.target.value)}
                  placeholder="Descripción del hero..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hero-primary-cta">Texto Botón Primario</Label>
                  <Input
                    id="hero-primary-cta"
                    value={items.hero.link_text}
                    onChange={(e) => handleChange("hero", "link_text", e.target.value)}
                    placeholder="Go to shop"
                  />
                </div>
                <div>
                  <Label htmlFor="hero-sec-cta">Texto Botón Secundario</Label>
                  <Input
                    id="hero-sec-cta"
                    value={String(items.hero.metadata?.secondary_cta || "See our beers")}
                    onChange={(e) => handleMetadataChange("hero", "secondary_cta", e.target.value)}
                    placeholder="See our beers"
                  />
                </div>
              </div>
            </div>
          </Container>
        </Tabs.Content>

        {/* BANNER TAB */}
        <Tabs.Content value="banner" className="mt-4">
          <Container className="flex flex-col gap-y-4 p-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <Heading level="h2">Banner Superior de Anuncios</Heading>
                <Text className="text-ui-fg-subtle">Aviso destacado sobre el menú o promociones temporales.</Text>
              </div>
              <div className="flex items-center gap-x-4">
                <div className="flex items-center gap-x-2">
                  <Label htmlFor="banner-active">Activo</Label>
                  <Switch
                    id="banner-active"
                    checked={items.banner.is_active}
                    onCheckedChange={(checked) => handleChange("banner", "is_active", checked)}
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={() => saveItem("banner")}
                  isLoading={savingKey === "banner"}
                >
                  Guardar Banner
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="banner-title">Mensaje del Banner</Label>
                <Input
                  id="banner-title"
                  value={items.banner.title}
                  onChange={(e) => handleChange("banner", "title", e.target.value)}
                  placeholder="¡NUEVA EDICIÓN LIMITADA! Prueba nuestra cerveza de temporada..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="banner-link-text">Texto del Enlace</Label>
                  <Input
                    id="banner-link-text"
                    value={items.banner.link_text}
                    onChange={(e) => handleChange("banner", "link_text", e.target.value)}
                    placeholder="Ver en tienda"
                  />
                </div>
                <div>
                  <Label htmlFor="banner-link-url">URL de Destino</Label>
                  <Input
                    id="banner-link-url"
                    value={items.banner.link_url}
                    onChange={(e) => handleChange("banner", "link_url", e.target.value)}
                    placeholder="/shop o https://..."
                  />
                </div>
              </div>
            </div>
          </Container>
        </Tabs.Content>

        {/* EVENT TAB */}
        <Tabs.Content value="event" className="mt-4">
          <Container className="flex flex-col gap-y-4 p-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <Heading level="h2">Próximo Evento / Taproom</Heading>
                <Text className="text-ui-fg-subtle">Promociona ferias, catas o eventos semanales.</Text>
              </div>
              <div className="flex items-center gap-x-4">
                <div className="flex items-center gap-x-2">
                  <Label htmlFor="event-active">Activo</Label>
                  <Switch
                    id="event-active"
                    checked={items.event.is_active}
                    onCheckedChange={(checked) => handleChange("event", "is_active", checked)}
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={() => saveItem("event")}
                  isLoading={savingKey === "event"}
                >
                  Guardar Evento
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="event-title">Nombre del Evento</Label>
                <Input
                  id="event-title"
                  value={items.event.title}
                  onChange={(e) => handleChange("event", "title", e.target.value)}
                  placeholder="Cata maridada de invierno"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event-subtitle">Fecha y Hora</Label>
                  <Input
                    id="event-subtitle"
                    value={items.event.subtitle}
                    onChange={(e) => handleChange("event", "subtitle", e.target.value)}
                    placeholder="Sábado 15 Octubre · 19:30h"
                  />
                </div>
                <div>
                  <Label htmlFor="event-location">Lugar / Ubicación</Label>
                  <Input
                    id="event-location"
                    value={String(items.event.metadata?.location || "")}
                    onChange={(e) => handleMetadataChange("event", "location", e.target.value)}
                    placeholder="Taproom Panda Beer, Madrid"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="event-body">Descripción del Evento</Label>
                <Textarea
                  id="event-body"
                  rows={3}
                  value={items.event.body}
                  onChange={(e) => handleChange("event", "body", e.target.value)}
                  placeholder="Detalles sobre lo que habrá en el evento..."
                />
              </div>

              <div>
                <Label htmlFor="event-image">URL de la Imagen o Cartel</Label>
                <Input
                  id="event-image"
                  value={items.event.image_url}
                  onChange={(e) => handleChange("event", "image_url", e.target.value)}
                  placeholder="https://... o ruta estática"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event-link-text">Texto del Botón</Label>
                  <Input
                    id="event-link-text"
                    value={items.event.link_text}
                    onChange={(e) => handleChange("event", "link_text", e.target.value)}
                    placeholder="Reservar plaza"
                  />
                </div>
                <div>
                  <Label htmlFor="event-link-url">Enlace (Web o formulario)</Label>
                  <Input
                    id="event-link-url"
                    value={items.event.link_url}
                    onChange={(e) => handleChange("event", "link_url", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </Container>
        </Tabs.Content>

        {/* INSTAGRAM TAB */}
        <Tabs.Content value="instagram" className="mt-4">
          <Container className="flex flex-col gap-y-4 p-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <Heading level="h2">Publicación de Instagram Destacada</Heading>
                <Text className="text-ui-fg-subtle">Destaca una foto, reel o post de Instagram directamente en la web.</Text>
              </div>
              <div className="flex items-center gap-x-4">
                <div className="flex items-center gap-x-2">
                  <Label htmlFor="insta-active">Activo</Label>
                  <Switch
                    id="insta-active"
                    checked={items.instagram.is_active}
                    onCheckedChange={(checked) => handleChange("instagram", "is_active", checked)}
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={() => saveItem("instagram")}
                  isLoading={savingKey === "instagram"}
                >
                  Guardar Instagram
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="insta-title">Título o Pie de Foto</Label>
                <Input
                  id="insta-title"
                  value={items.instagram.title}
                  onChange={(e) => handleChange("instagram", "title", e.target.value)}
                  placeholder="Última remesa en fábrica"
                />
              </div>

              <div>
                <Label htmlFor="insta-image">URL de la Imagen</Label>
                <Input
                  id="insta-image"
                  value={items.instagram.image_url}
                  onChange={(e) => handleChange("instagram", "image_url", e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="insta-url">Enlace Directo a Instagram</Label>
                <Input
                  id="insta-url"
                  value={items.instagram.link_url}
                  onChange={(e) => handleChange("instagram", "link_url", e.target.value)}
                  placeholder="https://instagram.com/p/..."
                />
              </div>

              <div>
                <Label htmlFor="insta-body">Texto o Comentario Adicional</Label>
                <Textarea
                  id="insta-body"
                  rows={2}
                  value={items.instagram.body}
                  onChange={(e) => handleChange("instagram", "body", e.target.value)}
                  placeholder="Comentario que acompaña la publicación..."
                />
              </div>
            </div>
          </Container>
        </Tabs.Content>
      </Tabs>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Contenidos",
  icon: DocumentText,
  rank: 2,
})

export default ContentAdminPage
