// This file is generated by rust-protobuf 3.4.0. Do not edit
// .proto file is parsed by protoc 26.1
// @generated

// https://github.com/rust-lang/rust-clippy/issues/702
#![allow(unknown_lints)]
#![allow(clippy::all)]

#![allow(unused_attributes)]
#![cfg_attr(rustfmt, rustfmt::skip)]

#![allow(box_pointers)]
#![allow(dead_code)]
#![allow(missing_docs)]
#![allow(non_camel_case_types)]
#![allow(non_snake_case)]
#![allow(non_upper_case_globals)]
#![allow(trivial_casts)]
#![allow(unused_results)]
#![allow(unused_mut)]

//! Generated file from `username_proof.proto`

/// Generated files are compatible only with the same version
/// of protobuf runtime.
const _PROTOBUF_VERSION_CHECK: () = ::protobuf::VERSION_3_4_0;

// @@protoc_insertion_point(message:UserNameProof)
#[derive(PartialEq,Clone,Default,Debug)]
pub struct UserNameProof {
    // message fields
    // @@protoc_insertion_point(field:UserNameProof.timestamp)
    pub timestamp: u64,
    // @@protoc_insertion_point(field:UserNameProof.name)
    pub name: ::std::vec::Vec<u8>,
    // @@protoc_insertion_point(field:UserNameProof.owner)
    pub owner: ::std::vec::Vec<u8>,
    // @@protoc_insertion_point(field:UserNameProof.signature)
    pub signature: ::std::vec::Vec<u8>,
    // @@protoc_insertion_point(field:UserNameProof.fid)
    pub fid: u64,
    // @@protoc_insertion_point(field:UserNameProof.type)
    pub type_: ::protobuf::EnumOrUnknown<UserNameType>,
    // special fields
    // @@protoc_insertion_point(special_field:UserNameProof.special_fields)
    pub special_fields: ::protobuf::SpecialFields,
}

impl<'a> ::std::default::Default for &'a UserNameProof {
    fn default() -> &'a UserNameProof {
        <UserNameProof as ::protobuf::Message>::default_instance()
    }
}

impl UserNameProof {
    pub fn new() -> UserNameProof {
        ::std::default::Default::default()
    }

    fn generated_message_descriptor_data() -> ::protobuf::reflect::GeneratedMessageDescriptorData {
        let mut fields = ::std::vec::Vec::with_capacity(6);
        let mut oneofs = ::std::vec::Vec::with_capacity(0);
        fields.push(::protobuf::reflect::rt::v2::make_simpler_field_accessor::<_, _>(
            "timestamp",
            |m: &UserNameProof| { &m.timestamp },
            |m: &mut UserNameProof| { &mut m.timestamp },
        ));
        fields.push(::protobuf::reflect::rt::v2::make_simpler_field_accessor::<_, _>(
            "name",
            |m: &UserNameProof| { &m.name },
            |m: &mut UserNameProof| { &mut m.name },
        ));
        fields.push(::protobuf::reflect::rt::v2::make_simpler_field_accessor::<_, _>(
            "owner",
            |m: &UserNameProof| { &m.owner },
            |m: &mut UserNameProof| { &mut m.owner },
        ));
        fields.push(::protobuf::reflect::rt::v2::make_simpler_field_accessor::<_, _>(
            "signature",
            |m: &UserNameProof| { &m.signature },
            |m: &mut UserNameProof| { &mut m.signature },
        ));
        fields.push(::protobuf::reflect::rt::v2::make_simpler_field_accessor::<_, _>(
            "fid",
            |m: &UserNameProof| { &m.fid },
            |m: &mut UserNameProof| { &mut m.fid },
        ));
        fields.push(::protobuf::reflect::rt::v2::make_simpler_field_accessor::<_, _>(
            "type",
            |m: &UserNameProof| { &m.type_ },
            |m: &mut UserNameProof| { &mut m.type_ },
        ));
        ::protobuf::reflect::GeneratedMessageDescriptorData::new_2::<UserNameProof>(
            "UserNameProof",
            fields,
            oneofs,
        )
    }
}

impl ::protobuf::Message for UserNameProof {
    const NAME: &'static str = "UserNameProof";

    fn is_initialized(&self) -> bool {
        true
    }

    fn merge_from(&mut self, is: &mut ::protobuf::CodedInputStream<'_>) -> ::protobuf::Result<()> {
        while let Some(tag) = is.read_raw_tag_or_eof()? {
            match tag {
                8 => {
                    self.timestamp = is.read_uint64()?;
                },
                18 => {
                    self.name = is.read_bytes()?;
                },
                26 => {
                    self.owner = is.read_bytes()?;
                },
                34 => {
                    self.signature = is.read_bytes()?;
                },
                40 => {
                    self.fid = is.read_uint64()?;
                },
                48 => {
                    self.type_ = is.read_enum_or_unknown()?;
                },
                tag => {
                    ::protobuf::rt::read_unknown_or_skip_group(tag, is, self.special_fields.mut_unknown_fields())?;
                },
            };
        }
        ::std::result::Result::Ok(())
    }

    // Compute sizes of nested messages
    #[allow(unused_variables)]
    fn compute_size(&self) -> u64 {
        let mut my_size = 0;
        if self.timestamp != 0 {
            my_size += ::protobuf::rt::uint64_size(1, self.timestamp);
        }
        if !self.name.is_empty() {
            my_size += ::protobuf::rt::bytes_size(2, &self.name);
        }
        if !self.owner.is_empty() {
            my_size += ::protobuf::rt::bytes_size(3, &self.owner);
        }
        if !self.signature.is_empty() {
            my_size += ::protobuf::rt::bytes_size(4, &self.signature);
        }
        if self.fid != 0 {
            my_size += ::protobuf::rt::uint64_size(5, self.fid);
        }
        if self.type_ != ::protobuf::EnumOrUnknown::new(UserNameType::USERNAME_TYPE_NONE) {
            my_size += ::protobuf::rt::int32_size(6, self.type_.value());
        }
        my_size += ::protobuf::rt::unknown_fields_size(self.special_fields.unknown_fields());
        self.special_fields.cached_size().set(my_size as u32);
        my_size
    }

    fn write_to_with_cached_sizes(&self, os: &mut ::protobuf::CodedOutputStream<'_>) -> ::protobuf::Result<()> {
        if self.timestamp != 0 {
            os.write_uint64(1, self.timestamp)?;
        }
        if !self.name.is_empty() {
            os.write_bytes(2, &self.name)?;
        }
        if !self.owner.is_empty() {
            os.write_bytes(3, &self.owner)?;
        }
        if !self.signature.is_empty() {
            os.write_bytes(4, &self.signature)?;
        }
        if self.fid != 0 {
            os.write_uint64(5, self.fid)?;
        }
        if self.type_ != ::protobuf::EnumOrUnknown::new(UserNameType::USERNAME_TYPE_NONE) {
            os.write_enum(6, ::protobuf::EnumOrUnknown::value(&self.type_))?;
        }
        os.write_unknown_fields(self.special_fields.unknown_fields())?;
        ::std::result::Result::Ok(())
    }

    fn special_fields(&self) -> &::protobuf::SpecialFields {
        &self.special_fields
    }

    fn mut_special_fields(&mut self) -> &mut ::protobuf::SpecialFields {
        &mut self.special_fields
    }

    fn new() -> UserNameProof {
        UserNameProof::new()
    }

    fn clear(&mut self) {
        self.timestamp = 0;
        self.name.clear();
        self.owner.clear();
        self.signature.clear();
        self.fid = 0;
        self.type_ = ::protobuf::EnumOrUnknown::new(UserNameType::USERNAME_TYPE_NONE);
        self.special_fields.clear();
    }

    fn default_instance() -> &'static UserNameProof {
        static instance: UserNameProof = UserNameProof {
            timestamp: 0,
            name: ::std::vec::Vec::new(),
            owner: ::std::vec::Vec::new(),
            signature: ::std::vec::Vec::new(),
            fid: 0,
            type_: ::protobuf::EnumOrUnknown::from_i32(0),
            special_fields: ::protobuf::SpecialFields::new(),
        };
        &instance
    }
}

impl ::protobuf::MessageFull for UserNameProof {
    fn descriptor() -> ::protobuf::reflect::MessageDescriptor {
        static descriptor: ::protobuf::rt::Lazy<::protobuf::reflect::MessageDescriptor> = ::protobuf::rt::Lazy::new();
        descriptor.get(|| file_descriptor().message_by_package_relative_name("UserNameProof").unwrap()).clone()
    }
}

impl ::std::fmt::Display for UserNameProof {
    fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
        ::protobuf::text_format::fmt(self, f)
    }
}

impl ::protobuf::reflect::ProtobufValue for UserNameProof {
    type RuntimeType = ::protobuf::reflect::rt::RuntimeTypeMessage<Self>;
}

#[derive(Clone,Copy,PartialEq,Eq,Debug,Hash)]
// @@protoc_insertion_point(enum:UserNameType)
pub enum UserNameType {
    // @@protoc_insertion_point(enum_value:UserNameType.USERNAME_TYPE_NONE)
    USERNAME_TYPE_NONE = 0,
    // @@protoc_insertion_point(enum_value:UserNameType.USERNAME_TYPE_FNAME)
    USERNAME_TYPE_FNAME = 1,
    // @@protoc_insertion_point(enum_value:UserNameType.USERNAME_TYPE_ENS_L1)
    USERNAME_TYPE_ENS_L1 = 2,
}

impl ::protobuf::Enum for UserNameType {
    const NAME: &'static str = "UserNameType";

    fn value(&self) -> i32 {
        *self as i32
    }

    fn from_i32(value: i32) -> ::std::option::Option<UserNameType> {
        match value {
            0 => ::std::option::Option::Some(UserNameType::USERNAME_TYPE_NONE),
            1 => ::std::option::Option::Some(UserNameType::USERNAME_TYPE_FNAME),
            2 => ::std::option::Option::Some(UserNameType::USERNAME_TYPE_ENS_L1),
            _ => ::std::option::Option::None
        }
    }

    fn from_str(str: &str) -> ::std::option::Option<UserNameType> {
        match str {
            "USERNAME_TYPE_NONE" => ::std::option::Option::Some(UserNameType::USERNAME_TYPE_NONE),
            "USERNAME_TYPE_FNAME" => ::std::option::Option::Some(UserNameType::USERNAME_TYPE_FNAME),
            "USERNAME_TYPE_ENS_L1" => ::std::option::Option::Some(UserNameType::USERNAME_TYPE_ENS_L1),
            _ => ::std::option::Option::None
        }
    }

    const VALUES: &'static [UserNameType] = &[
        UserNameType::USERNAME_TYPE_NONE,
        UserNameType::USERNAME_TYPE_FNAME,
        UserNameType::USERNAME_TYPE_ENS_L1,
    ];
}

impl ::protobuf::EnumFull for UserNameType {
    fn enum_descriptor() -> ::protobuf::reflect::EnumDescriptor {
        static descriptor: ::protobuf::rt::Lazy<::protobuf::reflect::EnumDescriptor> = ::protobuf::rt::Lazy::new();
        descriptor.get(|| file_descriptor().enum_by_package_relative_name("UserNameType").unwrap()).clone()
    }

    fn descriptor(&self) -> ::protobuf::reflect::EnumValueDescriptor {
        let index = *self as usize;
        Self::enum_descriptor().value_by_index(index)
    }
}

impl ::std::default::Default for UserNameType {
    fn default() -> Self {
        UserNameType::USERNAME_TYPE_NONE
    }
}

impl UserNameType {
    fn generated_enum_descriptor_data() -> ::protobuf::reflect::GeneratedEnumDescriptorData {
        ::protobuf::reflect::GeneratedEnumDescriptorData::new::<UserNameType>("UserNameType")
    }
}

static file_descriptor_proto_data: &'static [u8] = b"\
    \n\x14username_proof.proto\"\xaa\x01\n\rUserNameProof\x12\x1c\n\ttimesta\
    mp\x18\x01\x20\x01(\x04R\ttimestamp\x12\x12\n\x04name\x18\x02\x20\x01(\
    \x0cR\x04name\x12\x14\n\x05owner\x18\x03\x20\x01(\x0cR\x05owner\x12\x1c\
    \n\tsignature\x18\x04\x20\x01(\x0cR\tsignature\x12\x10\n\x03fid\x18\x05\
    \x20\x01(\x04R\x03fid\x12!\n\x04type\x18\x06\x20\x01(\x0e2\r.UserNameTyp\
    eR\x04type*Y\n\x0cUserNameType\x12\x16\n\x12USERNAME_TYPE_NONE\x10\0\x12\
    \x17\n\x13USERNAME_TYPE_FNAME\x10\x01\x12\x18\n\x14USERNAME_TYPE_ENS_L1\
    \x10\x02b\x06proto3\
";

/// `FileDescriptorProto` object which was a source for this generated file
fn file_descriptor_proto() -> &'static ::protobuf::descriptor::FileDescriptorProto {
    static file_descriptor_proto_lazy: ::protobuf::rt::Lazy<::protobuf::descriptor::FileDescriptorProto> = ::protobuf::rt::Lazy::new();
    file_descriptor_proto_lazy.get(|| {
        ::protobuf::Message::parse_from_bytes(file_descriptor_proto_data).unwrap()
    })
}

/// `FileDescriptor` object which allows dynamic access to files
pub fn file_descriptor() -> &'static ::protobuf::reflect::FileDescriptor {
    static generated_file_descriptor_lazy: ::protobuf::rt::Lazy<::protobuf::reflect::GeneratedFileDescriptor> = ::protobuf::rt::Lazy::new();
    static file_descriptor: ::protobuf::rt::Lazy<::protobuf::reflect::FileDescriptor> = ::protobuf::rt::Lazy::new();
    file_descriptor.get(|| {
        let generated_file_descriptor = generated_file_descriptor_lazy.get(|| {
            let mut deps = ::std::vec::Vec::with_capacity(0);
            let mut messages = ::std::vec::Vec::with_capacity(1);
            messages.push(UserNameProof::generated_message_descriptor_data());
            let mut enums = ::std::vec::Vec::with_capacity(1);
            enums.push(UserNameType::generated_enum_descriptor_data());
            ::protobuf::reflect::GeneratedFileDescriptor::new_generated(
                file_descriptor_proto(),
                deps,
                messages,
                enums,
            )
        });
        ::protobuf::reflect::FileDescriptor::new_generated_2(generated_file_descriptor)
    })
}
