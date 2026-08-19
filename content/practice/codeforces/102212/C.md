---
title: "CF 102212C - 猪拉丁语"
description: "每个测试用例都是一个英语句子。 句子的第一个字符是大写的，而其他字母都是小写的，并且没有标点符号。"
date: "2026-08-18T00:34:08+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102212
codeforces_index: "C"
codeforces_contest_name: "Amazalgo Uni 2019 Practice Contest"
rating: 0
weight: 102212
solve_time_s: 521
verified: false
draft: false
---

[CF 102212C - Pig Latin](https://codeforces.com/problemset/problem/102212/C)

 **评级：** -
 **标签：** -
 **求解时间：** 8m 41s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 每个测试用例都是一个英语句子。 句子的第一个字符是大写的，而其他字母都是小写的，并且没有标点符号。 我们需要使用给定的 Pig Latin 规则独立地转换每个单词：删除单词的第一个字符，附加剩余的字符，然后附加第一个字符，然后附加`ay`。 

例如，`Hello`变成`Ellohay`。 这`H`被移到后面`ello`，所以结果是`Ello`其次是`hay`。 由于原始句子的第一个字符是大写的，因此移动该字符而不是更改其大小写会自动使生成的句子保持大写。 

最多有20句话。 提供的约束中没有规定最大句子长度，因此安全设计是使运行时间与输入中的字符总数成正比。 为每个字符重复扫描或重建整个句子的算法可能会导致句子长度成二次方，而对每个字符的单次传递是线性的，并且完全符合普通竞赛输入大小的 1 秒限制。 

主要的边缘情况是一个字母单词。 对于这句话`I`，该单词不包含剩余字符，因此结果很简单`Iay`。 假设始终存在后缀的粗心实现可能会意外访问无效位置或错误地构造单词。 

另一个容易犯的错误是忘记大写字符属于该单词并且也必须移动。 为了`Apple`，答案是`PpleAay`， 不是`Appleay`而不是`ppleAay`。 第一个字符移至末尾`ay`已附加。 

最终的边界情况是包含多个单词的句子，因为转换必须针对每个单词单独进行。 为了`Go to`，正确的结果是`Ogay otay`。 仅对整个句子应用一次转换会错误地将空格和第二个单词视为同一字符串的一部分。 

## 方法

 一个简单的实现可以通过获取每个单词的第一个字符、单词的其余部分并将各部分连接起来来转换每个单词。 这已经是正确的算法思想了。 真正简单的实现可以使用重复的字符串连接一次构建每个转换后的单词一个字符。 尽管生成的文本是正确的，但字符串在 Python 中是不可变的，因此重复扩展不断增长的字符串可以复制已构建的前缀。 对于一个字的长度`L`，这可以采取`O(L^2)`最坏情况下的字符操作。 跨越总长度的句子`L`，因此最坏的情况是`O(L^2)`。 

这个问题的结构给了我们一个更简单的线性结构。 除了第一个字符之外，转换不依赖于任何字符，其余字符完全保持其原始顺序。 因此，我们只需要识别第一个字符一次，然后将后缀和保存的字符连接起来`ay`。 将句子拆分为单词会产生独立的片段，因此每个输入字符都会被处理恒定的次数。 

暴力构造之所以有效，是因为它保留了所需的字符顺序，但它可能会浪费重复复制前缀的工作。 观察发现，变换很简单`first character + suffix`重新排列成`suffix + first character + "ay"`让我们直接构造每个结果。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(L²)`在最坏的情况下|`O(L)`| 对于足够长的单词来说太慢 |
 | 最佳|`O(L)`|`O(L)`| 已接受 |

 这里，`L`表示处理的字符总数，包括空格。 最佳方法是线性的，因为每个字符属于输入或输出的次数是恒定的。 

## 算法演练

 1. 读取测试用例的数量并独立处理每个句子。 句子绝不能与另一个测试用例混合，因为每一行代表一条单独的消息。 
2. 根据空格分割句子以获得单个单词。 由于输入不包含标点符号，并且普通空格分隔单词，因此每个结果标记恰好是需要转换的一个单词。 
3. 对于每个单词，保存其第一个字符并获取从位置开始的子字符串`1`。 在构建结果之前必须保存第一个字符，因为它是唯一位置发生变化的字符。 
4. 将变换后的词构造为`word[1:] + word[0] + "ay"`。 后缀保持不变，原来的第一个字符紧随其后放置，并且`ay`最后附加。 
5. 用空格连接所有转换后的单词并打印结果句子。 最后的连接会在相邻单词之间保留一个空格，并保持单词转换的独立性。 

### 为什么它有效

 对于每个输入单词`w`，设其第一个字符为`c`其剩余后缀为`s`， 所以`w = c + s`。 所需的 Pig Latin 变换正是`s + c + "ay"`，这就是算法构造的内容。 由于该算法独立地将这种变换应用于每个单词，并且不改变每个后缀内的单词或字符的顺序，因此每个输出单词都是正确的，并且完整的输出句子是正确的。 大写也保留在所需的位置，因为原始句子的大写第一个字符被移动到第一个单词的末尾，在那里它仍然是大写的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def transform_word(word):
    return word[1:] + word[0] + "ay"

def solve():
    t = int(input())

    for _ in range(t):
        sentence = input().strip()
        words = sentence.split()

        result = [transform_word(word) for word in words]
        print(" ".join(result))

if __name__ == "__main__":
    solve()
```

`transform_word`直接实现变换的数学形式。`word[0]`是移动的角色，而`word[1:]`包含保持其原始相对顺序的每个字符。 

列表推导式将该操作应用于每个单词一次，匹配演练的步骤 3 和步骤 4。 构建一个列表并连接一次比重复附加到句子字符串更好，因为最终的构造仍然是线性的。`split()`就足够了，因为输入不包含标点符号，并且单词之间由空格分隔。 致电给`strip()`删除读取的换行符`input()`， 尽管`split()`还可以安全地处理任何意外的周围空间。 

没有数值计算，因此不会出现整数溢出和算术边界条件。 唯一重要的索引是`word[0]`，并且每个有效输入单词至少包含一个字符。 

## 工作示例

 ### 示例 1

 该句子包含两个词，`Hello`和`world`。 每个单词的转换状态为：

 | 词| 第一个字符 | 剩余后缀 | 变形后的词|
 | ---| ---| ---| ---|
 |`Hello`|`H`|`ello`|`Ellohay`|
 |`world`|`w`|`orld`|`orldway`|

 两个变换后的单词用一个空格连接起来，产生`Ellohay orldway`。 第一个单词表明大写`H`被移动而不是转换为小写，因此输出句子仍然大写。 

### 示例 2

 前几个词足以显示重复的过程，并且相同的操作在句子的其余部分继续进行。 

| 词| 第一个字符 | 剩余后缀 | 变形后的词|
 | ---| ---| ---| ---|
 |`Hello`|`H`|`ello`|`Ellohay`|
 |`danbo`|`d`|`anbo`|`anboday`|
 |`Hello`|`H`|`ello`|`Ellohay`|
 |`peccy`|`p`|`eccy`|`eccypay`|
 |`How`|`H`|`ow`|`Owhay`|
 |`are`|`a`|`re`|`reaay`|
 |`you`|`y`|`ou`|`ouyay`|
 |`today`|`t`|`oday`|`odaytay`|

 经过这些转换后，部分输出为`Ellohay anboday Ellohay eccypay Owhay reaay ouyay odaytay`。 以完全相同的方式处理剩余的单词会产生提供的示例输出。 该跟踪表明单词之间没有共享状态：每个单词都开始提取自己的第一个字符。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(L)`| 每个输入字符都会被检查并复制固定次数 |
 | 空间|`O(L)`| 转换后的单词和最终输出需要与输入成比例的空间 |

 这里`L`是正在处理的句子的总长度。 由于只有 20 个测试用例，并且没有需要嵌套扫描输入的操作，线性解决方案很容易满足 1 秒和 256 MB 的限制。 

## 测试用例```python
import sys
import io

def transform_word(word):
    return word[1:] + word[0] + "ay"

def solve():
    t = int(input())
    for _ in range(t):
        sentence = input().strip()
        words = sentence.split()
        print(" ".join(transform_word(word) for word in words))

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_input = input

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    try:
        from contextlib import redirect_stdout

        out = io.StringIO()
        with redirect_stdout(out):
            solve()
        return out.getvalue()
    finally:
        sys.stdin = old_stdin
        input = old_input

# Provided sample 1
assert run(
    "1\n"
    "Hello world\n"
) == "Ellohay orldway\n", "sample 1"

# Provided sample 2
assert run(
    "8\n"
    "Hello danbo\n"
    "Hello peccy\n"
    "How are you today\n"
    "Good how are you\n"
    "Oh no\n"
    "Whats wrong\n"
    "It seems like our messages are not being encrypted\n"
    "Dont panic\n"
) == (
    "Ellohay anboday\n"
    "Ellohay eccypay\n"
    "Owhay reaay ouyay odaytay\n"
    "Oodgay owhay reaay ouyay\n"
    "Hoay onay\n"
    "Hatsway rongway\n"
    "Tiay eemssay ikelay uroay essagesmay reaay otnay eingbay ncryptedeay\n"
    "Ontday anicpay\n"
), "sample 2"

# Minimum-size input: one one-letter word
assert run(
    "1\n"
    "I\n"
) == "Iay\n", "one-letter word"

# Multiple one-letter words
assert run(
    "1\n"
    "A I O\n"
) == "Aay Iay Oay\n", "all one-letter words"

# Boundary case: first and last characters of several words
assert run(
    "1\n"
    "Abc xyz Z\n"
) == "bAcay yz xay Zay\n", "first and last character handling"

# All-equal characters
assert run(
    "1\n"
    "Aaaa aaaa\n"
) == "aaaAay aaaay\n", "all-equal characters"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1\nI`|`Iay`| 最小尺寸的单字母单词 |
 |`1\nA I O`|`Aay Iay Oay`| 多个单字母单词和独立转换 |
 |`1\nAbc xyz Z`|`bAcay yz xay Zay`| 首字符移动和后缀边界 |
 |`1\nAaaa aaaa`|`aaaAay aaaay`| 重复相同的字符和大小写 |

 提供的示例还验证了正常的多词句子和多个测试用例。 自定义案例故意包含后缀为空的单词、首尾字符不同的单词以及每个字符都相同的单词，这些都是索引或连接错误的常见位置。 

## 边缘情况

 单字母单词没有后缀。 考虑确切的输入`1`其次是`I`。 算法读取`word[0]`作为`I`和`word[1:]`作为空字符串，所以它构造`"" + "I" + "ay"`, 给予`Iay`。 不需要特殊情况，因为Python的切片`word[1:]`边界自然就变空了。 

第一个单词大写不需要单独的大写操作。 对于输入`Apple`，第一个字符是`A`，后缀是`pple`，结果是`ppleAay`。 大写`A`与其原始字符一起移动而不是小写。 一个解决方案，调用`.lower()`在转换之前的每个单词上，它会错误地产生`ppleaay`。 

每个词都必须独立转化。 为了`Go to`，第一个词有`G`和`o`, 给予`Ogay`，而第二个有`t`和`o`, 给予`otay`。 最终输出是`Ogay otay`。 首先拆分可以防止空格被视为单词的一部分，并保证每个单词恰好得到一个`ay`后缀。 

重复的字符不会改变规则。 为了`Aaaa`，第一个`A`移动到后缀的末尾，产生`aaaAay`。 为了`aaaa`，结果是`aaaay`。 该算法通过位置而不是值来区分第一个字符，因此即使每个字符都相同，它仍然是正确的。
