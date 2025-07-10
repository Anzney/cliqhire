'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { ClientFormData } from '../types/client';

const industries = [
  'Healthcare',
  'Technology',
  'Manufacturing',
  'Retail',
  'Finance',
  'Other',
];

const clientSources = [
  'Cold Call',
  'Reference',
  'Sales Team',
  'Events',
  'Existing Old Client',
  'Others',
];

const linesOfBusiness = [
  'Executive Search',
  'Blue Collar Hiring',
  'Manpower Supply',
  'HR Managed Services',
  'HR Consulting',
  'Business Consulting',
  'Projects',
  'Investment Advisory',
];

export function ClientForm() {
  const [contacts, setContacts] = useState([{ name: '', position: '', email: '', phone: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClientFormData>({
    defaultValues: {
      companyName: '',
      website: '',
      location: {
        country: '',
        city: '',
      },
      industry: 'Other',
      contacts: [],
      origin: {
        source: 'Others',
        salesPerson: '',
        referral: {
          source: '',
          referredBy: '',
          feePercentage: 0,
          isExternal: false,
        },
        notes: '',
      },
      lineOfBusiness: [],
    },
  });

  const addContact = () => {
    setContacts([...contacts, { name: '', position: '', email: '', phone: '' }]);
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Client information saved successfully!');
      form.reset();
      setContacts([{ name: '', position: '', email: '', phone: '' }]);
    } catch (error) {
      toast.error('Failed to save client information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Client Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              {...form.register('companyName')}
              placeholder="Enter company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              {...form.register('website')}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              {...form.register('location.country')}
              placeholder="e.g. KSA"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...form.register('location.city')}
              placeholder="e.g. Riyadh"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select onValueChange={(value) => form.setValue('industry', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Contact Persons</h3>
          {contacts.map((_, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder="Name"
                {...form.register(`contacts.${index}.name`)}
              />
              <Input
                placeholder="Position"
                {...form.register(`contacts.${index}.position`)}
              />
              <Input
                placeholder="Email"
                type="email"
                {...form.register(`contacts.${index}.email`)}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Phone"
                  {...form.register(`contacts.${index}.phone`)}
                />
                {contacts.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeContact(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addContact}>
            <Plus className="h-4 w-4 mr-2" /> Add Contact
          </Button>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="crDocument">CR Document</Label>
              <Input
                id="crDocument"
                type="file"
                {...form.register('documents.crDocument')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vatDocument">VAT Document</Label>
              <Input
                id="vatDocument"
                type="file"
                {...form.register('documents.vatDocument')}
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Client Origin Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="source">Client Source</Label>
              <Select 
                onValueChange={(value) => form.setValue('origin.source', value as any)}
                defaultValue={form.getValues('origin.source')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {clientSources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salesPerson">Sales Person</Label>
              <Input
                id="salesPerson"
                {...form.register('origin.salesPerson')}
                placeholder="Name of sales person"
              />
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isExternal"
                onCheckedChange={(checked) => {
                  form.setValue('origin.referral.isExternal', checked as boolean);
                }}
              />
              <Label htmlFor="isExternal">External Referral</Label>
            </div>

            {form.watch('origin.referral.isExternal') && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="referralSource">Referral Source</Label>
                  <Input
                    id="referralSource"
                    {...form.register('origin.referral.source')}
                    placeholder="e.g. Partner, Client"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referredBy">Referred By</Label>
                  <Input
                    id="referredBy"
                    {...form.register('origin.referral.referredBy')}
                    placeholder="Name of referrer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feePercentage">Referral Fee %</Label>
                  <Input
                    id="feePercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    {...form.register('origin.referral.feePercentage')}
                    placeholder="0.00"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...form.register('origin.notes')}
              placeholder="Add any additional notes or comments about the client..."
              className="h-32"
            />
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Line of Business</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {linesOfBusiness.map((business) => (
              <div key={business} className="flex items-center space-x-2">
                <Checkbox
                  id={business}
                  onCheckedChange={(checked) => {
                    const current = form.getValues('lineOfBusiness');
                    if (checked) {
                      form.setValue('lineOfBusiness', [...current, business as any]);
                    } else {
                      form.setValue(
                        'lineOfBusiness',
                        current.filter((b) => b !== business)
                      );
                    }
                  }}
                />
                <Label htmlFor={business}>{business}</Label>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Client Information'}
        </Button>
      </div>
    </form>
  );
}