---
title: "CF 102800A - 和弦"
description: "每个测试用例描述了三个音符，这些音符已经按照从最低音到最高音的顺序排列。"
date: "2026-07-27T17:35:47+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102800
codeforces_index: "A"
codeforces_contest_name: "The 14th Jilin Provincial Collegiate Programming Contest"
rating: 0
weight: 102800
solve_time_s: 60
verified: true
draft: false
---

[CF 102800A - 和弦](https://codeforces.com/problemset/problem/102800/A)

 **评级：** -
 **标签：** -
 **求解时间：** 1m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个测试用例描述了三个音符，这些音符已经按照从最低音到最高音的顺序排列。 这些音符可能属于不同的八度音阶，但输入保证从第一个音符到第二个音符以及从第二个音符到第三个音符的距离最多为 11 个半音。 我们的任务是确定这三个音符是否构成大三和弦、小三和弦或两者都不构成。 

唯一重要的信息是连续音符之间的半音数。 大三和弦的音程为 4 个半音，后面跟着 3 个半音。 小三和弦的音程为 3 个半音，后面跟着 4 个半音。 任何其他对间隔必须报告为`Dissonance`。 

测试用例数量最多2000个，非常少。 每个测试用例仅包含三个注释，因此即使每个用例的恒定时间处理也绰绰有余。 该解决方案只需要从音符名称到它们在八度音阶内的位置的映射以及一些算术运算。 

第一个微妙的情况是当音符跨越八度边界时。 例如，```
A C E
```正确的输出是```
Minor triad
```注释`C`索引小于`A`在一个八度内，但实际上是在下一个八度内。 简单地减去倍频程索引就会产生负值。 每当下一个音符的索引较小时，音程计算必须加 12。 

另一个容易犯的错误是假设每个递增的音符序列都可以归类为和弦。 例如，```
C F A
```音程为 5 个半音和 4 个半音，这两个和弦定义都不匹配。 正确的输出是```
Dissonance
```最后一种边缘情况是，输入在音符名称方面在音乐上下降，但由于八度音阶而音高仍然上升。```
E D C
```正确的输出是```
Dissonance
```虽然`D`和`C`在半音阶中出现较早，它们属于较高八度。 忽略八度环绕的解决方案将计算出不正确的负距离。 

## 方法

 一种直接的方法是直接模拟音乐定义。 将每个音符转换为其在八度音阶内的位置，计算连续音符之间的半音距离，在必要时调整八度音环绕，然后将两个距离与两个有效模式进行比较。 

人们还可以想象生成每一种可能的大调和小调三和弦，并检查输入是否与其中之一匹配。 由于只有 12 种可能的根音和两种和弦类型，因此这仍然只需要 24 个模式并且很容易足够快。 虽然正确，但它引入了不必要的预处理和比较。 

直接音程计算更简单，因为问题定义已经用连续的半音距离表示。 一旦每个音符映射到 0 到 11 之间的整数，每个测试用例就会减少到两个区间计算和两次比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 每个测试用例 O(24) | O(24) | 已接受，但没有必要 |
 | 最佳| 每个测试用例 O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 创建从每个音符名称到其在半音阶中的位置的映射。 
2. 读出三个音符并将它们转换成数字位置。 
3. 计算第一个音符到第二个音符的音程。 如果第二个位置较小，则在减去之前先加 12，这样音程就代表向上移动到下一个八度。 
4. 以完全相同的方式计算第二个间隔。 
5. 如果两个区间是`(4, 3)`， 打印`Major triad`。 
6. 否则，如果间隔为`(3, 4)`， 打印`Minor triad`。 
7. 否则，打印`Dissonance`。 

### 为什么它有效

 输入保证音符已经按照从低音到高音的顺序排列。 唯一的复杂之处是向上移动可能会跨越八度边界。 每当数字音符值减少时添加 12 即可重建实际的向上半音距离。 计算出这两个距离后，弦类型完全由问题定义确定。 由于每个可能的输入都会产生一对连续的音程，因此该算法始终能够正确地对和弦进行分类。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

pos = {
    "C": 0,
    "C#": 1,
    "D": 2,
    "D#": 3,
    "E": 4,
    "F": 5,
    "F#": 6,
    "G": 7,
    "G#": 8,
    "A": 9,
    "A#": 10,
    "B": 11,
}

def interval(a, b):
    if b < a:
        b += 12
    return b - a

t = int(input())

for _ in range(t):
    n1, n2, n3 = input().split()

    x = pos[n1]
    y = pos[n2]
    z = pos[n3]

    d1 = interval(x, y)
    d2 = interval(y, z)

    if d1 == 4 and d2 == 3:
        print("Major triad")
    elif d1 == 3 and d2 == 4:
        print("Minor triad")
    else:
        print("Dissonance")
```该字典将半音音阶存储为从 0 到 11 的整数。这使得音程计算成为简单的整数减法，而不是字符串处理。 

辅助函数处理实现中唯一棘手的部分。 当第二个音符的数值较小时，它属于下一个八度，因此添加 12 即可重建正确的向上距离。 因为该语句保证每个音程最多为 11 个半音，所以这种调整总是足够的。 

每个测试用例计算两个间隔并将它们与仅有的两个有效模式进行比较。 不存在一一偏差的问题，因为半音阶是用连续的整数表示的，并且每个音程都直接测量为八度调整后位置之间的差异。 

## 工作示例

 ### 示例 1

 输入：```
C E G
```| 注意| 数值|
 | ---| ---|
 | C | 0 |
 | 电子| 4 |
 | G | 7 |

 | d1 | d2 | 结果 |
 | ---| ---| ---|
 | 4 | 3 | 大三和弦|

 间隔与主要三元组定义完全匹配，因此算法打印`Major triad`。 

### 示例 2

 输入：```
A C E
```| 注意| 数值|
 | ---| ---|
 | 一个 | 9 |
 | C | 0 |
 | 电子| 4 |

 | d1 | d2 | 结果 |
 | ---| ---| ---|
 | (12 + 0) - 9 = 3 | 4 | 小三和弦|

 这个例子说明了为什么八度调整是必要的。 如果不加 12，第一个间隔将错误地变为`-9`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(T)| 每个测试用例都执行持续的工作。 |
 | 空间| O(1) | O(1) | 仅存储固定音符映射和一些变量。 |

 即使最多有 2000 个测试用例，总工作量也很小。 该解决方案很容易满足给定的限制。 

## 测试用例```python
import sys
import io

def solve():
    import sys
    input = sys.stdin.readline

    pos = {
        "C": 0,
        "C#": 1,
        "D": 2,
        "D#": 3,
        "E": 4,
        "F": 5,
        "F#": 6,
        "G": 7,
        "G#": 8,
        "A": 9,
        "A#": 10,
        "B": 11,
    }

    def interval(a, b):
        if b < a:
            b += 12
        return b - a

    t = int(input())
    out = []

    for _ in range(t):
        a, b, c = input().split()
        d1 = interval(pos[a], pos[b])
        d2 = interval(pos[b], pos[c])

        if d1 == 4 and d2 == 3:
            out.append("Major triad")
        elif d1 == 3 and d2 == 4:
            out.append("Minor triad")
        else:
            out.append("Dissonance")

    print("\n".join(out))

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    ans = sys.stdout.getvalue()
    sys.stdin = backup_stdin
    sys.stdout = backup_stdout
    return ans

assert run(
"""5
C E G
A C E
B D F#
C F A
E D C
"""
) == (
"""Major triad
Minor triad
Minor triad
Dissonance
Dissonance
"""
)

assert run(
"""1
C E G
"""
) == (
"""Major triad
"""
)

assert run(
"""1
A C E
"""
) == (
"""Minor triad
"""
)

assert run(
"""1
C F A
"""
) == (
"""Dissonance
"""
)

assert run(
"""1
B D# F#
"""
) == (
"""Major triad
"""
)
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`C E G`|`Major triad`| 标准大调和弦。 |
 |`A C E`|`Minor triad`| 八度环绕的正确处理。 |
 |`C F A`|`Dissonance`| 间隔模式无效。 |
 |`B D# F#`|`Major triad`| 跨越八度边界的大和弦。 |

 ## 边缘情况

 考虑输入```
1
A C E
```映射的值是`9`,`0`， 和`4`。 该算法检测到`0 < 9`，加上 12，并将第一个间隔计算为`3`。 第二个间隔是`4`。 由于区间对是`(3, 4)`，输出是```
Minor triad
```这可以正确处理八度环绕。 

现在考虑```
1
C F A
```映射的值是`0`,`5`， 和`9`。 间隔变为`(5, 4)`。 有效的和弦模式都不匹配，因此算法打印```
Dissonance
```这证实了仅接受两个精确的间隔序列。 

最后，考虑```
1
E D C
```映射的值是`4`,`2`， 和`0`。 该算法将间隔计算为`(10, 10)`八度调整后。 两对都不匹配`(4, 3)`或者`(3, 4)`，所以输出是```
Dissonance
```这表明降序音符名称不会混淆音程计算，因为八度环绕是显式处理的。
