import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import ChatView from './ChatView';
import Colors from '../constants/Colors';
export type Ref = BottomSheet;

interface Props {
	channelId: string;
}

const CustomBottomSheet = forwardRef<Ref, Props>((props, ref) => {
	const snapPoints = useMemo(() => ['15%', '100%'], []);

	const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
			<BottomSheet
				ref={ref}
				index={0}
				keyboardBehavior='interactive'
				android_keyboardInputMode="adjustPan"
				snapPoints={snapPoints}
				handleIndicatorStyle={{ backgroundColor: Colors.primary }}
				backgroundStyle={{ backgroundColor: '#fff' }}
			>
				<BottomSheetView style={{flex: 1, paddingBottom: 70}}>
					<Text style={styles.containerHeadline}>Chat</Text>
					
						<ChatView channelId={props.channelId} />
					
				</BottomSheetView>
			</BottomSheet>
		</TouchableWithoutFeedback>
	);
});

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		
	},
	containerHeadline: {
		fontSize: 24,
		fontWeight: '600',
		padding: 20,
		textAlign: 'center'
	}
});

export default CustomBottomSheet;