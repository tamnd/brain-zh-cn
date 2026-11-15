---
title: "CF 81A - 插入式"
description: "我们得到一个小写字符串，其中可能包含意外的重复击键。 每当两个相等的字符相邻时，必须删除这两个字符。 删除一对后，可能会出现新的相邻相等对，这些也必须删除。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 81
codeforces_index: "A"
codeforces_contest_name: "Yandex.Algorithm Open 2011: Qualification 1"
rating: 1400
weight: 81
solve_time_s: 96
verified: true
draft: false
---

[CF 81A - 插件](https://codeforces.com/problemset/problem/81/A)

 **评分：** 1400
 **标签：** 实施
 **求解时间：** 1m 36s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个小写字符串，其中可能包含意外的重复击键。 每当两个相等的字符相邻时，必须删除这两个字符。 删除一对后，可能会出现新的相邻相等对，这些也必须删除。 

该过程继续进行，直到没有剩余相邻的相同字符为止。 必须打印最后剩余的字符串。 

例如，考虑字符串`abccba`。 

首先是一对`cc`消失：```
abccba -> abba
```现在有一双新的`bb`变得相邻：```
abba -> aa
```最后：```
aa -> ""
```重要的细节是删除可能会在以后触发更多删除。 仅删除原始字符串中可见的对的解决方案是错误的。 

输入长度可达`2 * 10^5`，这立即排除了从头开始重复重建字符串的可能性。 任何多次扫描整个字符串的算法都可能变成二次算法。 拥有20万个字符，`O(n^2)`方法可能需要数百亿次运算，远远超出了时间限制。 

需要线性或接近线性的解决方案。 

一些边缘情况很容易被错误处理。 

考虑：```
aaaa
```粗心的实现可能只删除第一对并停止：```
aaaa -> aa
```但剩下的`aa`也一定会消失，所以正确的结果是空字符串。 

另一个棘手的情况是：```
abccba
```最终取消的相等字符在原始字符串中并不相邻。 它们仅在早期删除后才变得相邻。 任何独立处理对而不考虑连锁反应的方法都会在这里失败。 

第三个重要场景是交替角色：```
abababab
```不存在相邻的相等对，因此输出必须保持不变。 该算法必须避免删除不相邻的相等字母。 

最后，边界行为很重要。 对于输入：```
aaab
```前两个`a`字符消失：```
aaab -> ab
```剩余单人`a`必须留下来。 删除后不正确的索引移动通常会导致此处出现错误。 

## 方法

 最直接的解决方案是重复扫描字符串寻找相邻的相等字符。 只要找到一个，请删除该对并重新启动扫描。 

例如：```
abbaca
```变成：```
aaca
```然后：```
ca
```这种方法是正确的，因为它准确地模拟了问题陈述。 

问题是效率。 从字符串中间删除字符的成本很高，并且反复重新启动扫描会使情况变得更糟。 在最坏的情况下，每次删除可能需要移动几乎整个字符串。 

假设输入长度为`n`。 我们可能会表演`O(n)`删除，并且每次删除可能会花费`O(n)`由于复制或重建字符串而花费的时间。 总复杂度变为`O(n^2)`。 

和`n = 200000`，二次行为太慢了。 

关键的观察是，在处理新字符时，只有最近幸存的字符才重要。 

想象一下从左到右构建最终的字符串。 

如果当前字符与最后幸存的字符不同，则必须暂时保留。 

如果它与最后一个幸存的字符匹配，则这两个字符立即相互抵消。 

这种行为正是堆栈所提供的。 

我们维护一个堆栈，其中包含处理字符串前缀后当前剩余的字符。 

读取新字符时：

 如果它与栈顶匹配，我们就会弹出栈顶，因为该对消失了。 

否则，我们会推动角色。 

每个字符最多被压入一次，最多弹出一次，从而提供线性复杂性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了|
 | 最佳堆栈解决方案| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 创建一个空堆栈。 
2. 从左到右处理字符串，一次处理一个字符。 
3. 对于当前字符，检查栈是否非空，以及栈顶元素是否等于当前字符。 
4. 如果相等，则将栈顶元素移出。 

该模型删除了连续的相等对。 
5. 否则，将当前字符压入堆栈。 

该角色目前幸存并可能与未来的角色互动。 
6. 处理完所有字符后，堆栈中正好包含剩余的字符串。 
7. 将堆栈字符连接在一起并打印结果。 

### 为什么它有效

 堆栈始终存储到目前为止看到的前缀的完全处理结果。 

假设我们已经处理了第一个`i`字符正确。 当性格`i + 1`当字符到达时，在该字符和当前最后一个幸存字符之间只能形成一对新的相邻字符。 

如果它们相等，则两者都会消失，因此弹出是正确的。 

如果它们不同，则还无法删除涉及新字符的内容，因此推送是正确的。 

因为每一步都保留了前缀的正确处理形式，所以最终的堆栈正是完全缩减的字符串。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    s = input().strip()

    stack = []

    for ch in s:
        if stack and stack[-1] == ch:
            stack.pop()
        else:
            stack.append(ch)

    print("".join(stack))

solve()
```该解决方案直接遵循堆栈思想。 

这`stack`list 存储处理当前前缀后剩余的字符。 

对于每个角色`ch`，我们将它与栈顶进行比较。 

如果两者相等，则它们在当前缩减的字符串中形成相邻的相等对，因此我们删除顶部`pop()`。 

否则，该角色暂时存活，因此我们将其附加。 

最后，堆栈已经按顺序包含了最终答案，因此`"".join(stack)`有效地构造结果字符串。 

使用 Python 列表作为堆栈非常重要。 追加和从末尾弹出都是`O(1)`运营。 

一个常见的错误是在处理过程中重复连接字符串。 由于 Python 字符串是不可变的，因此重复连接会重复创建新字符串，并且可能会降低到二次复杂度。 

另一个微妙的细节是使用`strip()`读取输入时。 输入行以换行符结尾，我们不希望将该换行符作为字符串的一部分进行处理。 

## 工作示例

 ### 示例 1

 输入：```
hhoowaaaareyyoouu
```| 当前角色 | 堆栈之前 | 行动| 堆栈之后 |
 | --- | --- | --- | --- |
 | 小时 | “” | 推| 小时 |
 | 小时 | 小时 | 流行 | “” |
 | 哦| “” | 推| 哦|
 | 哦| 哦| 流行 | “” |
 | 瓦 | “” | 推| 瓦 |
 | 一个 | 瓦 | 推| 佤 |
 | 一个 | 佤 | 流行 | 瓦 |
 | 一个 | 瓦 | 推| 佤 |
 | 一个 | 佤 | 流行 | 瓦 |
 | r | 瓦 | 推| 写 |
 | 电子| 写 | 推| 雷 |
 | y | 雷 | 推| 雷 |
 | y | 雷 | 流行 | 雷 |
 | 哦| 雷 | 推| 雷奥 |
 | 哦| 雷奥 | 流行 | 雷 |
 | 你| 雷 | 推| 韦鲁|
 | 你| 韦鲁| 流行 | 雷 |

 最终输出：```
wre
```这个例子演示了重复的链式反应。 几对立即消失，随后的角色继续与更新的堆栈状态进行交互。 

### 示例 2

 输入：```
abccba
```| 当前角色 | 堆栈之前 | 行动| 堆栈之后 |
 | --- | --- | --- | --- |
 | 一个 | “” | 推| 一个 |
 | 乙| 一个 | 推| ab |
 | c | ab | 推| ABC |
 | c | ABC | 流行 | ab |
 | 乙| ab | 流行 | 一个 |
 | 一个 | 一个 | 流行 | “” |

 最终输出：```
""
```这个痕迹显示了为什么链式反应很重要。 第一次删除会创建一个新的相邻对，进而创建另一个相邻对。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个字符被推入一次并最多弹出一次 |
 | 空间| O(n) | 最坏情况下堆栈可能会存储整个字符串 |

 由于最多 200,000 个字符，线性复杂度很容易满足限制。 堆栈操作的时间恒定，因此即使在最大输入上，实现也能高效运行。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    s = input().strip()

    stack = []

    for ch in s:
        if stack and stack[-1] == ch:
            stack.pop()
        else:
            stack.append(ch)

    print("".join(stack))

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

# provided sample
assert run("hhoowaaaareyyoouu\n") == "wre", "sample 1"

# minimum size
assert run("a\n") == "a", "single character"

# all equal
assert run("aaaaaa\n") == "", "all characters removed"

# chain reactions
assert run("abccba\n") == "", "multiple cascading removals"

# no removals
assert run("abababab\n") == "abababab", "alternating characters"

# boundary behavior
assert run("aaab\n") == "ab", "remaining character after deletion"

# large-style pattern
assert run("aabbccddeeff\n") == "", "repeated adjacent pairs"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a`|`a`| 最小输入尺寸|
 |`aaaaaa`|`""`| 重复级联删除 |
 |`abccba`|`""`| 中间体去除后的连锁反应|
 |`abababab`|`abababab`| 没有发生删除 |
 |`aaab`|`ab`| 部分删除后的正确处理 |
 |`aabbccddeeff`|`""`| 多个独立的相邻对|

 ## 边缘情况

 考虑输入：```
aaaa
```执行：```
stack = []
read 'a' -> push -> [a]
read 'a' -> pop  -> []
read 'a' -> push -> [a]
read 'a' -> pop  -> []
```最终输出：```
""
```这证实了该算法自然地处理重复的级联删除，而无需重新扫描字符串。 

现在考虑：```
abccba
```执行：```
[a]
[a, b]
[a, b, c]
[a, b]
[a]
[]
```重要的细节是第二个`b`仅在以下时间后取消`cc`对消失。 堆栈自动捕获这个新的邻接关系。 

最后，考虑：```
aaab
```执行：```
[a]
[]
[a]
[a, b]
```最终输出：```
ab
```当连续出现奇数个相同字符时，这将验证正确的处理。 只有完整的配对才会消失，而剩下的不匹配的角色则会幸存。
