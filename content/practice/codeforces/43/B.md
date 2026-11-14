---
title: "CF 43B - 字母"
description: "我们有两个字符串。 第一个字符串是报纸标题，第二个字符串是 Vasya 想要从中构建的匿名信。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 43
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 42 (Div. 2)"
rating: 1100
weight: 43
solve_time_s: 91
verified: true
draft: false
---
[CF 43B - 信件](https://codeforces.com/problemset/problem/43/B)

 **评分：** 1100
 **标签：** 实现、字符串
 **求解时间：** 1m 31s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个字符串。 第一个字符串是报纸标题，第二个字符串是 Vasya 想要从中构建的匿名信。 

标题中的每个非空格字符最多可以使用一次。 空间很特殊，它们不消耗任何东西。 如果字母文本包含空格，Vasya 可以简单地在字符之间留下间隙，而不需要标题中的实际空格字符。 

任务是确定目标文本中每个必需的字母是否可以由标题以足够的频率提供。 大写字母和小写字母被视为不同的字符，因此`'A'`和`'a'`不可互换。 

字符串很短，最多 200 个字符长。 即使是低效的解决方案也能轻松满足限制，因为超过 200 个字符的二次扫描仅执行大约 40,000 次操作。 这意味着问题不在于高级优化，而在于正确处理字符计数。 

棘手的部分是必须完全忽略空格。 粗心的实现可能会将空格视为正常字符并错误地拒绝有效答案。 

考虑这个输入：```
abc
a c
```正确答案是：```
YES
```标题不包含空格，但空格不需要删掉，所以字母还是可以的。 

区分大小写是错误的另一个常见来源。```
Abc
abc
```正确答案是：```
NO
```标题包含大写字母`A`，但字母需要小写`a`。 

当某个字符出现在标题中但出现的次数不够多时，就会出现另一种微妙的情况。```
hello
helloo
```正确答案是：```
NO
```仅检查每个字符是否至少出现一次的解决方案在这里会失败，因为目标需要两个`'o'`人物。 

## 方法

 最直接的暴力破解方法就是逐个字符地处理目标字符串。 对于信件中的每个非空格字符，扫描标题，直到找到匹配的未使用字符。 使用后，标记该字符，以便以后不能重复使用。 

这是可行的，因为目标中的每个字母都明确消耗源中的一个匹配字母。 问题是每次查找都可能扫描几乎整个标题。 如果两个字符串都有长度`n`，这导致`O(n^2)`时间复杂度。 

和`n ≤ 200`，即使这种方法也很容易通过。 在最坏的情况下，我们会做`200 × 200 = 40,000`比较。 尽管如此，该方法还是很笨拙，因为它需要花费时间反复搜索我们可以数一次的字符。 

更好的观察是只有频率才重要。 标题中的字母顺序无关紧要。 如果这封信需要三个`'a'`个字符，标题必须至少包含三个`'a'`某处的字符。 

这就把问题变成了计数任务。 我们计算每个非空格字符在标题中出现的次数，然后遍历目标文本并消耗每个所需字符的出现次数。 如果某个角色在任何时候不可用，都会立即得到答案`"NO"`。 

这将逻辑时间缩短为线性时间，因为每个字符都被处理一次。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 已接受 |
 | 最佳| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取标题字符串和目标字母字符串。 
2. 为标题中的字符创建频率图。 

我们只计算非空格字符，因为空格是免费的，不需要从报纸上剪掉。 
3. 一次一个字符地遍历目标字母。 
4. 如果当前字符是空格，则跳过。 

空间永远不会消耗标题中的任何内容。 
5. 对于每个非空格字符，检查其在图中的频率是否为正。 

如果计数为零，则标题不包含该字符的足够副本，因此打印`"NO"`并立即停止。 
6. 否则，将该字符的出现频率减一。 

该模型使用从标题中剪下的一个字母。 
7. 如果整个目标字符串处理成功，则打印`"YES"`。 

### 为什么它有效

 该算法保持了频率图始终代表标题中剩余未使用字母的不变性。 

每当目标需要一个字符时，我们就会消耗一个匹配的事件。 如果所需的字符不可用，则任何排列都不可能构建目标，因为每个可用字符都已经被恰好考虑过一次。 

由于空格被忽略，并且所有其他字符都与可用的字符进行匹配，因此该算法完全接受可构造的字母并拒绝所有不可能的字母。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

headline = input().rstrip('\n')
letter = input().rstrip('\n')

freq = {}

for ch in headline:
    if ch != ' ':
        freq[ch] = freq.get(ch, 0) + 1

for ch in letter:
    if ch == ' ':
        continue

    if freq.get(ch, 0) == 0:
        print("NO")
        break

    freq[ch] -= 1
else:
    print("YES")
```第一部分完全按照输入读取两行。 使用`rstrip('\n')`很重要，因为我们只想删除输入添加的尾随换行符，而不是属于字符串的内部或前导空格。 

字典`freq`存储标题中每个字符剩余的未使用副本数。 空格被跳过，因为它们与构造无关。 

第二个循环处理目标字母。 每当出现空格时，算法都会立即忽略它。 对于普通字符，字典查找检查是否仍然存在至少一个未使用的副本。 

这`for ... else`这里的结构很方便。 这`else`仅当循环完成且未命中时才执行块`break`。 这意味着答案是`"YES"`恰好在没有检测到字符短缺的时候。 

一个微妙的实现细节是使用`freq.get(ch, 0)`。 没有默认值`0`，查询从未出现在标题中的字符会引发错误。 

## 工作示例

 ### 示例 1

 输入：```
Instead of dogging Your footsteps it disappears but you dont notice anything
where is your dog
```追踪：

 | 当前角色 | 之前可用 | 可用时间 | 结果 |
 | --- | --- | --- | --- |
 | 瓦 | 0 | 0 | 失败|
 | 剩余字符 | 未处理| 未处理| 否 |

 该算法立即失败，因为小写`'w'`没有出现在标题中。 标题包含大写字母和许多小写字母，但不包含小写字母`'w'`。 

这个例子表明，一旦检测到不可能性，算法就会停止，而不是进行不必要的扫描。 

### 示例 2

 输入：```
hello world
hello
```追踪：

 | 当前角色 | 之前可用 | 可用时间 | 结果 |
 | --- | --- | --- | --- |
 | 小时 | 1 | 0 | 继续 |
 | 电子| 1 | 0 | 继续 |
 | 我| 3 | 2 | 继续 |
 | 我| 2 | 1 | 继续 |
 | 哦| 2 | 1 | 继续 |

 最终输出：```
YES
```该跟踪显示了如何正确处理重复的字符。 计数为`'l'`减少两倍，因为目标需要两个副本。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个字符串被扫描一次 |
 | 空间| O(n) | 频率图存储字符计数 |

 输入长度最多为 200 个字符，因此解决方案在限制内立即运行。 对于这种规模，即使是 Python 字典操作实际上也是恒定时间。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    headline = input().rstrip('\n')
    letter = input().rstrip('\n')

    freq = {}

    for ch in headline:
        if ch != ' ':
            freq[ch] = freq.get(ch, 0) + 1

    for ch in letter:
        if ch == ' ':
            continue

        if freq.get(ch, 0) == 0:
            print("NO")
            return

        freq[ch] -= 1

    print("YES")

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out

# provided sample
assert run(
    "Instead of dogging Your footsteps it disappears but you dont notice anything\n"
    "where is your dog\n"
) == "NO\n", "sample 1"

# minimum-size input
assert run(
    "a\n"
    "a\n"
) == "YES\n", "single character"

# spaces should not matter
assert run(
    "abc\n"
    "a c\n"
) == "YES\n", "spaces ignored"

# case sensitivity
assert run(
    "Abc\n"
    "abc\n"
) == "NO\n", "uppercase and lowercase differ"

# insufficient frequency
assert run(
    "hello\n"
    "helloo\n"
) == "NO\n", "repeated character shortage"

# large repeated input
assert run(
    "a" * 200 + "\n" +
    "a" * 200 + "\n"
) == "YES\n", "maximum equal strings"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a / a`| 是 | 最小有效案例 |
 |`abc / a c`| 是 | 空格不消耗字符 |
 |`Abc / abc`| 否 | 区分大小写 |
 |`hello / helloo`| 否 | 频率计数 |
 | 200`'a'`人物 | 是 | 最大长度处理 |

 ## 边缘情况

 考虑目标包含空格但标题不包含空格的情况。 

输入：```
abc
a b c
```该算法构建了这个频率图：```
a:1, b:1, c:1
```扫描目标时，空格会被完全跳过。 仅有的`'a'`,`'b'`， 和`'c'`消耗计数。 所有计数仍然有效，因此输出变为：```
YES
```这证实空格被正确忽略。 

现在考虑区分大小写。 

输入：```
A
a
```频率图仅包含大写字母`'A'`。 

当算法检查小写时`'a'`,`freq.get('a', 0)`回报`0`。 该算法立即打印：```
NO
```这表明大写和小写字母被视为不同的符号。 

最后，考虑重复字符短缺。 

输入：```
banana
bananaa
```初始频率：

 | 人物 | 计数 |
 | --- | --- |
 | 乙| 1 |
 | 一个 | 3 |
 | n | 2 |

 目标需要四个`'a'`人物。 消耗完前三个后，剩余计数变为零。 当算法达到第四个时`'a'`，它检测到短缺并打印：```
NO
```这验证了该算法跟踪的是准确的频率而不是简单的存在。
