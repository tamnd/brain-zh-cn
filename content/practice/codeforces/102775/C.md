---
title: "CF 102775C-\u0422\u0430\u043a\u0438\u0435\u0440\u0430\u0437\u043d\u044b\u0435\u0441\u0442\u0440\u043e\u043a\u0438"
description: "我们得到一个小写拉丁字符串。 如果一个字符串从不包含三个连续的元音并且从不包含三个连续的辅音，则该字符串被认为是好的。 如果这两种情况中的任何一种出现在字符串中的任何位置，则该字符串是错误的。"
date: "2026-07-28T03:03:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102775
codeforces_index: "C"
codeforces_contest_name: "ICPC Central Russia Regional Contest (CRRC 20), \u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442 \u0426\u0435\u043d\u0442\u0440\u0430\u043b\u044c\u043d\u043e\u0439 \u0420\u043e\u0441\u0441\u0438\u0438, \u043a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u0440\u0430\u0443\u043d\u0434"
rating: 0
weight: 102775
solve_time_s: 77
verified: true
draft: false
---

[CF 102775C - \u0422\u0430\u043a\u0438\u0435\u0440\u0430\u0437\u043d\u044b\u0435 \u0441\u0442\u0440\u043e\u043a\u0438](https://codeforces.com/problemset/problem/102775/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个小写拉丁字符串。 如果一个字符串从不包含三个连续的元音并且从不包含三个连续的辅音，则该字符串被认为是好的。 如果这两种情况中的任何一种出现在字符串中的任何位置，则该字符串是错误的。 

任务只是确定输入字符串属于哪个类别。 如果存在禁止序列，则打印`BAD`。 否则，打印`GOOD`。 

字符串长度最多为`100000`，这立即表明每个字符只应处理一次。 重复重新扫描字符串的各个部分（例如独立检查每个子字符串）的算法在最坏的情况下会执行太多操作。 另一方面，线性扫描仅执行大约十万个字符检查，这很容易符合限制。 

一些边缘情况值得关注。 

少于三个字符的字符串永远不能包含三个连续的元音或辅音。 例如：```
ab
```正确的输出是：```
GOOD
```盲目检查三元组而不检查长度的粗心实现可能会访问字符串之外的字符。 

顺序必须是连续的。 例如：```
ababa
```正确的输出是：```
GOOD
```虽然整体上有很多元音和很多辅音，但它们不断被中断，所以没有一个游程达到长度三。 

连续符可能出现在字符串的开头或结尾。 例如：```
aaab
```正确的输出是：```
BAD
```相似地，```
baaa
```也是`BAD`。 仅检查字符串中间的实现可能会错过这些情况。 

这封信`y`是这个问题中的元音。 例如：```
yyy
```必须产生：```
BAD
```治疗`y`因为辅音会产生错误的答案。 

## 方法

 最直接的解决方案是检查每组三个连续字符。 对于每个三元组，确定所有三个都是元音还是所有三个都是辅音。 如果任一条件成立，则立即给出答案`BAD`; 否则继续直到字符串末尾。 

这种方法已经是正确的，因为每个禁止模式都由三个连续的字母组成。 任何较长的串，例如四个连续的元音，内部必然包含一个三元音。 

一个效率低得多的蛮力想法是枚举每个子字符串并检查它是否包含三个连续的元音或辅音。 一个长度的字符串`100000`有大约`5 × 10^9`子串，使得这种方法完全不切实际。 

关键的观察结果是只有当前的连续运行才重要。 每当当前字符与前一个字符具有相同的类型、元音或辅音时，游程长度就会增加。 否则游程长度重置为一。 一旦任一运行达到三，我们就已经知道答案是`BAD`，并且不需要进一步处理。 

这允许仅使用几个变量从左到右一次处理字符串。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(1) | O(1) | 太慢了|
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 将所有元音存储在包含`a`,`e`,`i`,`o`,`u`， 和`y`。 集合中的成员资格检查是恒定时间的。 
2. 初始化两个计数器，一个用于当前连续的元音，一个用于当前连续的辅音。 两者都从零开始。 
3. 从左到右扫描字符串。 
4. 如果当前字符是元音，则将元音计数器加一，并将辅音计数器重置为零。 这反映出任何辅音的运行都已被中断。 
5. 如果当前字符是辅音，则将辅音计数器加一，并将元音计数器重置为零。 
6. 更新计数器后，检查任一计数器是否已达到 3。 如果是这样，则打印`BAD`立即，因为发现了禁止运行。 
7. 如果扫描完成后任一计数器均未达到 3，则打印`GOOD`。 

### 为什么它有效

 在每个位置，元音计数器等于完全由连续元音组成的当前后缀的长度，并且辅音计数器等于完全由连续辅音组成的当前后缀的长度。 这些值得以正确维护，因为只要处理一个新字符，一个计数器就会增加，而另一个计数器则会重置。 由于每个禁止模式恰好是同一类型的至少三个连续字母的运行，因此达到计数器值 3 对于声明该字符串为错误字符串是必要且充分的。

 ## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    s = input().strip()
    vowels = set("aeiouy")

    vowel_run = 0
    consonant_run = 0

    for ch in s:
        if ch in vowels:
            vowel_run += 1
            consonant_run = 0
        else:
            consonant_run += 1
            vowel_run = 0

        if vowel_run >= 3 or consonant_run >= 3:
            print("BAD")
            return

    print("GOOD")

if __name__ == "__main__":
    solve()
```该解决方案首先创建一组元音，以便可以在恒定时间内对每个字符进行分类。 

两个计数器代表当前的游程长度。 其中一个在每次迭代中都会增长，而另一个则由于当前运行已被中断而被重置。 

更新计数器后立即检查长度为 3 的游程。 这允许程序在知道答案后立即终止。 

使用`strip()`从输入中删除尾随换行符，同时保持实际字符串不变。 不使用索引，因此当字符串少于三个字符时不存在边界问题。 

## 工作示例

 ### 示例 1

 输入：```
good
```| 人物 | 类型 | 元音运行| 辅音运行 | 决定|
 | ---| ---| ---| ---| ---|
 | 克| 辅音| 0 | 1 | 继续 |
 | 哦| 元音 | 1 | 0 | 继续 |
 | 哦| 元音 | 2 | 0 | 继续 |
 | d | 辅音| 0 | 1 | 继续 |

 扫描完成后，任何一个计数器都没有达到 3，所以答案是`GOOD`。 这表明元音和辅音之间的切换正确地重置了相反的计数器。 

### 示例 2

 输入：```
bad
```| 人物 | 类型 | 元音运行| 辅音运行 | 决定|
 | ---| ---| ---| ---| ---|
 | 乙| 辅音| 0 | 1 | 继续 |
 | 一个 | 元音 | 1 | 0 | 继续 |
 | d | 辅音| 0 | 1 | 继续 |

 两个计数器都没有达到 3，所以答案是`GOOD`。 这个例子证实了孤立的元音和辅音不会在中断时累积。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个字符只处理一次。 |
 | 空间| O(1) | O(1) | 仅存储固定大小的元音集和两个计数器。 |

 该算法对字符串执行单次传递并使用恒定的附加内存。 即使对于长度的字符串，这也可以轻松满足约束`100000`。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline
    s = input().strip()
    vowels = set("aeiouy")

    vowel_run = 0
    consonant_run = 0

    for ch in s:
        if ch in vowels:
            vowel_run += 1
            consonant_run = 0
        else:
            consonant_run += 1
            vowel_run = 0

        if vowel_run >= 3 or consonant_run >= 3:
            print("BAD")
            return

    print("GOOD")

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue().strip()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout
    return out

# provided samples
assert run("good\n") == "GOOD", "sample 1"
assert run("bad\n") == "GOOD", "sample 2"
assert run("zashtsheeshtschayjushtsheekhsya\n") == "BAD", "sample 3"
assert run("dlinnosheee\n") == "BAD", "sample 4"

# custom cases
assert run("a\n") == "GOOD", "single character"
assert run("yyy\n") == "BAD", "y is a vowel"
assert run("bcdf\n") == "BAD", "four consecutive consonants"
assert run(("ab" * 50000) + "\n") == "GOOD", "maximum length alternating pattern"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`a`|`GOOD`| 最小可能长度|
 |`yyy`|`BAD`| 正确治疗`y`作为元音 |
 |`bcdf`|`BAD`| 长辅音串检测 |
 |`ab`重复50000次|`GOOD`| 无禁止运行的最大输入大小 |

 ## 边缘情况

 考虑输入：```
ab
```算法流程`a`， 然后`b`。 计数器变成`(1, 0)`进而`(0, 1)`。 都没有达到三，所以输出是`GOOD`。 由于该算法从不假设字符串至少具有三个字符，因此不存在边界问题。 

现在考虑：```
ababa
```在整个扫描过程中，计数器在一个元音和一个辅音之间交替。 每次类型更改都会重置相反的计数器，因此两次运行都不会超过 1。 输出正确`GOOD`。 

对于输入：```
aaab
```元音计数器演变为`1`,`2`,`3`。 一旦达到三，算法立即打印`BAD`而不扫描剩余的字符。 这可以正确检测到禁止的前缀。 

最后，考虑：```
yyy
```自从`y`属于元音集，元音计数器变为`1`,`2`,`3`，算法输出`BAD`。 这与问题的元音定义相匹配，并避免了常见的错误`y`作为辅音。
