'use client';

import { Upload, Plus, X, Volume2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface FormData {
  title: string;
  description: string;
  location: string;
  tourType: string;
  embedUrl: string;
}

interface AudioRegion {
  id: number;
  title: string;
  audioUrl?: string;
  volume: number;
  radius: number;
  regionType: 'sphere' | 'box';
  spatialAudio: boolean;
  autoPlay: boolean;
}

export default function CreateTour() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    location: '',
    tourType: '360_image',
    embedUrl: '',
  });

  const [hotspots, setHotspots] = useState([
    { id: 1, title: 'Hotspot 1', type: 'info' },
  ]);

  const [audioRegions, setAudioRegions] = useState<AudioRegion[]>([
    { id: 1, title: 'Ambient Background', audioUrl: '', volume: 0.8, radius: 10, regionType: 'sphere', spatialAudio: true, autoPlay: true },
  ]);

  const [editingAudio, setEditingAudio] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addHotspot = () => {
    const newId = Math.max(...hotspots.map((h) => h.id), 0) + 1;
    setHotspots([...hotspots, { id: newId, title: `Hotspot ${newId}`, type: 'info' }]);
  };

  const removeHotspot = (id: number) => {
    setHotspots(hotspots.filter((h) => h.id !== id));
  };

  const addAudioRegion = () => {
    const newId = Math.max(...audioRegions.map((a) => a.id), 0) + 1;
    setAudioRegions([...audioRegions, {
      id: newId,
      title: `Audio Region ${newId}`,
      audioUrl: '',
      volume: 0.8,
      radius: 10,
      regionType: 'sphere',
      spatialAudio: true,
      autoPlay: true,
    }]);
  };

  const removeAudioRegion = (id: number) => {
    setAudioRegions(audioRegions.filter((a) => a.id !== id));
  };

  const updateAudioRegion = (id: number, field: keyof AudioRegion, value: string | number | boolean) => {
    setAudioRegions(audioRegions.map((a) =>
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  return (
    <div className="min-h-screen">
   

      <div className="px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Create New Tour</h1>

        <div className="space-y-8">
          {/* Tour Information */}
          <div className="border border-gray-200 rounded-lg p-8 bg-white/50">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tour Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Tour Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Downtown Loft"
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your tour..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., New York, NY"
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Tour Type</label>
                <select
                  name="tourType"
                  value={formData.tourType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                >
                  <option value="360_image">360° Image</option>
                  <option value="360_video">360° Video</option>
                  <option value="3d_model">3D Model</option>
                  <option value="embed">Embedded Tour</option>
                </select>
              </div>

              {formData.tourType === 'embed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Embed URL</label>
                  <input
                    type="url"
                    name="embedUrl"
                    value={formData.embedUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/tour"
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                  />
                </div>
              )}

              {formData.tourType !== 'embed' && (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-900 font-medium mb-1">Upload your {formData.tourType} file</p>
                  <p className="text-sm text-gray-500 mb-4">Drag and drop or click to browse</p>
                  <button className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium">
                    Browse Files
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hotspots Configuration */}
          <div className="border border-gray-200 rounded-lg p-8 bg-white/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Interactive Hotspots</h2>
              <button
                onClick={addHotspot}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Hotspot
              </button>
            </div>

            <div className="space-y-4">
              {hotspots.map((hotspot) => (
                <div key={hotspot.id} className="flex items-center gap-4 p-4 rounded-lg bg-white/50 border border-gray-200">
                  <input
                    type="text"
                    defaultValue={hotspot.title}
                    placeholder="Hotspot title"
                    className="flex-1 px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                  />
                  <select
                    defaultValue={hotspot.type}
                    className="px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                  >
                    <option value="info">Info</option>
                    <option value="link">Link</option>
                    <option value="audio">Audio</option>
                    <option value="image">Image</option>
                  </select>
                  <button
                    onClick={() => removeHotspot(hotspot.id)}
                    className="p-2 rounded hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Audio Regions - Enhanced */}
          <div className="border border-gray-200 rounded-lg p-8 bg-white/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-gray-900" />
                Audio Regions
              </h2>
              <button
                onClick={addAudioRegion}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Audio Region
              </button>
            </div>

            <div className="space-y-4">
              {audioRegions.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-lg border border-dashed border-gray-200">
                  <p className="text-gray-500">No audio regions configured</p>
                </div>
              ) : (
                audioRegions.map((region) => (
                  <div key={region.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white/50">
                    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setEditingAudio(editingAudio === region.id ? null : region.id)}>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{region.title}</h3>
                        <p className="text-sm text-gray-500">{region.regionType === 'sphere' ? 'Spherical' : 'Box'} • Radius: {region.radius}m • Volume: {Math.round(region.volume * 100)}%</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAudioRegion(region.id);
                        }}
                        className="p-2 rounded hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {editingAudio === region.id && (
                      <div className="border-t border-gray-200 p-4 space-y-4 bg-white">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Region Title</label>
                          <input
                            type="text"
                            value={region.title}
                            onChange={(e) => updateAudioRegion(region.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Region Type</label>
                            <select
                              value={region.regionType}
                              onChange={(e) => updateAudioRegion(region.id, 'regionType', e.target.value)}
                              className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                            >
                              <option value="sphere">Sphere</option>
                              <option value="box">Box</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Radius (meters)</label>
                            <input
                              type="number"
                              value={region.radius}
                              onChange={(e) => updateAudioRegion(region.id, 'radius', parseFloat(e.target.value))}
                              className="w-full px-3 py-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Volume: {Math.round(region.volume * 100)}%</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={region.volume}
                            onChange={(e) => updateAudioRegion(region.id, 'volume', parseFloat(e.target.value))}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Audio File</label>
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-500 mb-2">Drag audio file or click to browse</p>
                            <button className="px-3 py-1 rounded bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm font-medium">
                              Upload
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={region.spatialAudio}
                              onChange={(e) => updateAudioRegion(region.id, 'spatialAudio', e.target.checked)}
                              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                            />
                            <span className="text-sm text-gray-900">Enable Spatial Audio (3D positioning)</span>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={region.autoPlay}
                              onChange={(e) => updateAudioRegion(region.id, 'autoPlay', e.target.checked)}
                              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                            />
                            <span className="text-sm text-gray-900">Auto-play when entering region</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end">
            <Link href="/gallery" className="px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-gray-900">
              Cancel
            </Link>
            <button className="px-6 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium">
              Create Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}