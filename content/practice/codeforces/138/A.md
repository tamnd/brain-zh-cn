---
title: "CF 138A - 文学课"
description: "每首诗分为四行四行诗。 如果从末尾的第 k 个元音开始的后缀在两行中相同，则两行押韵。 例如，当 k = 1 时，我们从最后一个元音开始比较后缀。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 138
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 99 (Div. 1)"
rating: 1600
weight: 138
solve_time_s: 120
verified: true
draft: false
---

[CF 138A - 文学课](https://codeforces.com/problemset/problem/138/A)

 **评分：** 1600
 **标签：** 实施
 **求解时间：** 2m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每首诗分为四行四行诗。 如果从末尾的第 k 个元音开始的后缀在两行中相同，则两行押韵。 例如，与`k = 1`，我们从最后一个元音开始比较后缀。 和`k = 2`，我们从倒数第二个元音开始比较后缀。 

对于每个四行诗，我们只关心四种可能的韵律结构：

 -`aabb`, 意思是线`(1,2)`押韵和`(3,4)`韵
 -`abab`， 意义`(1,3)`押韵和`(2,4)`韵
 -`abba`， 意义`(1,4)`押韵和`(2,3)`韵
 -`aaaa`，意味着所有四行押韵在一起

 如果每个四行诗都符合相同的结构，那么整首诗就有一个有效的结构。 四行押韵的四行诗是灵活的，因为它可以代表任何方案。 

输入给出`n`绝句及其价值`k`。 那么来吧`4n`文本行。 我们必须输出有效方案之一或`"NO"`如果不存在共同方案。 

约束足够小，我们不需要复杂的字符串算法。 最多有`2500`绝句，所以最多`10000`线。 所有字符串的总长度仅为`10^4`，这意味着即使多次扫描每个字符也是很便宜的。 一个`O(total_length)`或者`O(total_length + n)`解决方案很容易足够快。 

棘手的部分不是表演，而是正确处理韵律规则。 

一个常见的错误是处理行数少于`k`元音彼此匹配。 它们从不与任何东西押韵，包括另一句短句。 

例如：```
1 2
sky
try
day
may
```前两行每行仅包含一个元音，因此它们不能押韵`k = 2`。 正确的输出是：```
NO
```另一个容易的错误是忘记了`aaaa`绝句与每个方案兼容。 

例子：```
2 1
day
may
sun
fun
code
mode
road
toad
```第一首绝句是`aabb`。 第二个是`aaaa`。 整首诗至今仍然有效`aabb`。 

当多个方案单独适合但没有一个方案全局适用时，就会出现第三种微妙的情况。 

例子：```
2 1
day
may
sun
fun
red
bed
red
bed
```第一绝句仅`aabb`。 第二个是`abab`和`abba`。 所有四行诗都没有通用的方案，所以答案是：```
NO
```## 方法

 每当我们需要测试两行是否押韵时，强力解决方案都会直接逐行比较。 对于每次比较，我们向后扫描以找到第 k 个元音，提取后缀，并将其与另一个后缀进行比较。 

这是可行的，因为总输入大小很小。 即使我们对每个四行诗进行多次比较，处理的文本总量仍然是可以管理的。 

暴力版本的弱点是重复。 同一行可能会参与多次韵律检查，导致我们反复重新计算其韵律后缀。 

关键的观察结果是，一行可以简化为单个规范表示：从末尾的第 k 个元音开始的后缀。 一旦我们计算了这个后缀一次，韵律检查就变成了简单的相等性测试。 

例如：```
commit -> ommit   (k = 2)
hermit -> ermit
```现在押韵减少为：```
suffix1 == suffix2
```如果一行少于`k`元音，我们给它分配一个无效的标记，它会自动失败每个韵律测试。 

每个四行诗只有四行，因此只有三种有意义的配对模式需要测试。 在确定四行诗支持哪些方案后，我们将这些可能性与全局有效方案集相交。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n × 平均行长度 × 重复检查次数) | O(1) | O(1) | 已接受 |
 | 最佳| O(总长度 + n) | O(总长度) | 已接受 |

 ## 算法演练

 1. 读取所有输入行。 
2. 对于每一行，计算其韵尾。 

从右到左扫描字符串，同时计算元音。 一旦到达第 k 个元音，就存储从那里开始的子串。 

如果扫描在找到之前完成`k`元音，将该行标记为无效。 
3. 独立处理每首四行诗。 

令四个处理后的后缀为`a, b, c, d`。 
4. 确定该绝句支持哪些韵律。 

仅当两个后缀都有效且相等时，两行之间才存在押韵。 
5、先查四行韵。 

如果所有四个后缀都相等且有效，则此四行诗支持`aaaa`。 
6. 检查剩余的图案。`aabb`要求：```
a == b and c == d
```

`abab`要求：```
a == c and b == d
```

`abba`要求：```
a == d and b == c
```7. 维护一套全球仍然可能的诗歌方案。 

最初：```
{aabb, abab, abba}
```一首绝句支撑`aaaa`不限制任何东西。 

否则，将全局集与该四行支持的方案相交。 
8. 如果全局集变空，则打印`"NO"`。 
9. 否则打印：

 -`"aaaa"`如果每首绝句都完全押韵
 - 否则任何剩余的方案

 ### 为什么它有效

 每行都被转换为在问题规则下定义押韵的精确子字符串。 当且仅当这些处理后的后缀相等且有效时，两行才押韵。 

对于每首四行诗，我们明确测试所有合法的韵律结构。 只有当每个四行诗都与其兼容时，一个方案才能在全球范围内生存。 由于该算法永远不会删除真正有效的方案，也不会接受无效的方案，因此所有交集后的剩余集合正是有效诗歌方案的集合。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

VOWELS = set("aeiou")

def get_suffix(s, k):
    cnt = 0

    for i in range(len(s) - 1, -1, -1):
        if s[i] in VOWELS:
            cnt += 1

        if cnt == k:
            return s[i:]

    return None

def solve():
    n, k = map(int, input().split())

    schemes = {"aabb", "abab", "abba"}
    all_aaaa = True

    for _ in range(n):
        lines = [input().strip() for _ in range(4)]
        suf = [get_suffix(x, k) for x in lines]

        possible = set()

        if (
            suf[0] is not None and
            suf[0] == suf[1] == suf[2] == suf[3]
        ):
            possible.add("aaaa")

        if (
            suf[0] is not None and
            suf[0] == suf[1] and
            suf[2] is not None and
            suf[2] == suf[3]
        ):
            possible.add("aabb")

        if (
            suf[0] is not None and
            suf[0] == suf[2] and
            suf[1] is not None and
            suf[1] == suf[3]
        ):
            possible.add("abab")

        if (
            suf[0] is not None and
            suf[0] == suf[3] and
            suf[1] is not None and
            suf[1] == suf[2]
        ):
            possible.add("abba")

        if "aaaa" not in possible:
            all_aaaa = False
            schemes &= possible

    if all_aaaa:
        print("aaaa")
    elif schemes:
        print(sorted(schemes)[0])
    else:
        print("NO")

solve()
```辅助函数`get_suffix`直接实现韵律定义。 它向后扫描直到到达第 k 个元音。 返回`None`无效行比返回空字符串更安全，因为空字符串可能会意外比较相等。 

四行诗的逻辑反映了每个韵律方案的数学定义。 每次比较都会明确检查参与的后缀是否有效。 

这`all_aaaa`flag 处理特殊规则，即如果每个四行诗都完全押韵，则答案必须是`"aaaa"`而不是任意的兼容方案。 

全局交叉步骤是核心思想。 每个四行诗都限制了允许的诗歌方案集。 一旦一个四行诗的方案失败，以后就永远无法恢复。 

## 工作示例

 ### 示例 1

 输入：```
1 1
day
may
sun
fun
```处理后缀：

 | 线路| 后缀 |
 | --- | --- |
 | 日 | 哎呀|
 | 可能 | 哎呀|
 | 太阳 | 联合国|
 | 有趣| 联合国|

 方案检查：

 | 方案| 有效 |
 | --- | --- |
 | 啊啊| 没有 |
 | aabb | 是的 |
 | 阿巴 | 没有 |
 | 阿爸| 没有 |

 最终答案：```
aabb
```该跟踪显示了最简单的非平凡情况。 只有一种配对模式有效，因此诗歌方案是唯一确定的。 

### 示例 2

 输入：```
2 1
code
mode
road
toad
red
bed
red
bed
```第一绝句：

 | 线路| 后缀 |
 | --- | --- |
 | 代码| 颂歌|
 | 模式| 颂歌|
 | 道路 | 负载|
 | 蟾蜍 | 负载|

 有效方案：

 | 方案| 有效 |
 | --- | --- |
 | 啊啊| 没有 |
 | aabb | 是的 |
 | 阿巴 | 没有 |
 | 阿爸| 没有 |

 全局集变为：```
{aabb}
```第二绝句：

 | 线路| 后缀 |
 | --- | --- |
 | 红色| 编辑|
 | 床 | 编辑|
 | 红色| 编辑|
 | 床 | 编辑|

 有效方案：

 | 方案| 有效 |
 | --- | --- |
 | 啊啊| 是的 |
 | aabb | 是的 |
 | 阿巴 | 是的 |
 | 阿爸| 是的 |

 第二绝句没有施加任何限制，因为`aaaa`是有效的。 

最终答案：```
aabb
```这说明了为什么`aaaa`绝句必须特殊对待。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(总长度 + n) | 提取后缀时，每个字符都会扫描一次 |
 | 空间| O(总长度) | 存储的后缀字符串主导内存使用

 总输入大小仅为`10^4`字符，因此该解决方案很容易满足限制。 即使是 Python 字符串切片在这种规模下也是完全安全的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

VOWELS = set("aeiou")

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def get_suffix(s, k):
        cnt = 0

        for i in range(len(s) - 1, -1, -1):
            if s[i] in VOWELS:
                cnt += 1

            if cnt == k:
                return s[i:]

        return None

    n, k = map(int, input().split())

    schemes = {"aabb", "abab", "abba"}
    all_aaaa = True

    for _ in range(n):
        lines = [input().strip() for _ in range(4)]
        suf = [get_suffix(x, k) for x in lines]

        possible = set()

        if (
            suf[0] is not None and
            suf[0] == suf[1] == suf[2] == suf[3]
        ):
            possible.add("aaaa")

        if (
            suf[0] is not None and
            suf[0] == suf[1] and
            suf[2] is not None and
            suf[2] == suf[3]
        ):
            possible.add("aabb")

        if (
            suf[0] is not None and
            suf[0] == suf[2] and
            suf[1] is not None and
            suf[1] == suf[3]
        ):
            possible.add("abab")

        if (
            suf[0] is not None and
            suf[0] == suf[3] and
            suf[1] is not None and
            suf[1] == suf[2]
        ):
            possible.add("abba")

        if "aaaa" not in possible:
            all_aaaa = False
            schemes &= possible

    if all_aaaa:
        return "aaaa"
    elif schemes:
        return sorted(schemes)[0]
    else:
        return "NO"

# provided sample
assert run(
"""1 1
day
may
sun
fun
"""
) == "aabb"

# minimum-size input with full rhyme
assert run(
"""1 1
cat
hat
mat
bat
"""
) == "aaaa"

# insufficient vowels
assert run(
"""1 2
sky
try
day
may
"""
) == "NO"

# conflicting schemes
assert run(
"""2 1
day
may
sun
fun
red
bed
red
bed
"""
) == "aabb"

# only abab works
assert run(
"""1 1
light
stone
bright
phone
"""
) == "abab"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 全韵独行绝句 | 啊啊| 万韵特殊处理|
 | 元音太少的行 | 否 | 无效行永远不会押韵 |
 | 混合兼容绝句| aabb | 全局交集逻辑 |
 | 仅交叉配对 | 阿巴 | 正确方案检测 |
 | 最小有效输入 | 啊啊| 边界尺寸处理|

 ## 边缘情况

 考虑行不包含足够元音的情况。 

输入：```
1 2
sky
try
day
may
```该算法计算：

 | 线路| 后缀 |
 | --- | --- |
 | 天空| 无 |
 | 尝试| 无 |
 | 日 | 哎呀|
 | 可能 | 哎呀|

 每个方案至少需要一次涉及无效后缀的比较，因此不添加任何方案`possible`。 最终答案变成`"NO"`。 

现在考虑一首完全押韵的四行诗。 

输入：```
1 1
red
bed
fed
led
```所有后缀都变成`"ed"`。 

该算法将所有四种方案标记为有效，包括`aaaa`。 因为每首绝句都满足`aaaa`，最终的输出正是：```
aaaa
```这很重要，因为打印`"aabb"`从技术上讲可以描述押韵模式，但问题明确要求`"aaaa"`当每首绝句完全押韵时。 

最后，考虑不兼容的绝句。 

输入：```
2 1
day
may
sun
fun
cat
dog
cat
dog
```第一绝句仅支持`aabb`。 

第二个仅支持`abab`。 

交叉后：```
{aabb} ∩ {abab} = empty
```该算法立即检测到不存在全局方案并打印：```
NO
```
