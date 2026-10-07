---
title: "CF 105910A - SCUPC"
description: "我们有三个相同长度的二进制字符串。 在每个位置，我们查看这三个位，如果至少有两个位为 1，则对该位置进行计数。我们可以精确地选取三个字符串之一，并将其​​循环向左旋转任意次数。"
date: "2026-06-25T14:03:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105910
codeforces_index: "A"
codeforces_contest_name: "The 23rd Sichuan University Programming Contest"
rating: 0
weight: 105910
solve_time_s: 62
verified: true
draft: false
---

[CF 105910A - SCUPC](https://codeforces.com/problemset/problem/105910/A)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有三个相同长度的二进制字符串。 在每个位置，我们查看这三个位，并计算该位置（如果至少有两个位）`1`。 

我们可以精确地选择三个字符串中的一个并将其向左循环旋转任意次。 另外两根弦保持固定。 在选择要旋转的最佳字符串和最佳旋转量后，我们需要尽可能多的位置，其中三个位中至少有两个位是`1`。 竞赛语句给出了多个测试用例，所有字符串长度之和最多为$10^5$。 

总长度界限是关键的观察结果。 任何尝试所有的解决方案$n$轮换并评估所有$n$每次轮换的位置需要$O(n^2)$每个测试用例的工作量，当$n$达到$10^5$。 我们周围需要一些东西$O(n \log n)$。 

一个微妙的点是，旋转不同的字符串会产生不同的优化问题。 仅考虑旋转第三根弦的解决方案可能会错过最佳值。 

考虑：```
n = 3
s1 = 110
s2 = 001
s3 = 001
```旋转`s3`不等于旋转`s1`。 必须从所有三个选项中选出最佳答案。 

另一个容易犯的错误是只优化成对重叠。 目标不是所有三个字符串的位置数量`1`，但是至少有两个字符串具有的位置数`1`。 

例如：```
s1 = 10
s2 = 10
s3 = 01
```第一个位置已经起作用，因为两个字符串包含`1`，即使第三个字符串包含`0`。 

## 方法

 直接暴力解决方案很简单。 选择要旋转的字符串。 全部尝试$n$循环移位。 对于每个班次，扫描所有$n$位置并计算有多少位置包含至少两个。 

暴力方法是正确的，因为它显式检查每个有效配置。 其运行时间为$O(3n^2)$，这实际上是$O(n^2)$。 和$n = 10^5$，这意味着大约$10^{10}$操作，远远超出极限。 

为了找到更快的方法，我们需要重写评分函数。 

假设我们旋转第三根弦。 让$$a_i=s_{1,i}, \quad b_i=s_{2,i}, \quad c_i=s_{3,i}.$$对于二进制值，至少有两位等于的指示符`1`可以写成$$[a_i+b_i+c_i\ge2]
=
a_ib_i+a_ic_i+b_ic_i-2a_ib_ic_i.$$对所有位置求和得出$$\text{score}
=
\sum a_ib_i
+
\sum a_ic_i
+
\sum b_ic_i
-
2\sum a_ib_ic_i.$$第一项不依赖于旋转。 

现在定义$$d_i=a_i+b_i-2a_ib_i.$$检查所有四种可能性$(a_i,b_i)$:

 |$a_i$|$b_i$|$d_i$|
 | ---| ---| ---|
 | 0 | 0 | 0 |
 | 0 | 1 | 1 |
 | 1 | 0 | 1 |
 | 1 | 1 | 0 |

 所以$d_i = a_i \oplus b_i$。 

分数变为$$\sum a_ib_i + \sum d_i \cdot c_i.$$轮换后，只有第二项发生变化。 问题简化为：

 找到二进制串之间的最大循环重叠$d=a\oplus b$和旋转后的字符串$c$。 

这是一个经典的循环互相关问题。 所有移位值均可通过一次 FFT 卷积同时计算。 

我们对旋转字符串的三种可能选择重复相同的计算，并取最大答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(n^2)$|$O(1)$| 太慢了 |
 | 最佳 FFT |$O(n \log n)$|$O(n)$| 已接受 |

 ## 算法演练

 ### 计算第三个字符串旋转时的值

 1.让`a`,`b`， 和`c`是三个二进制数组。 
2. 计算$$\text{base}=\sum a_i b_i.$$这部分在旋转下永远不会改变`c`。 
3. 计算$$d_i=a_i\oplus b_i.$$任何班次的分数变为$$\text{base} + \sum d_i \cdot c_{i+\text{shift}}.$$4. 构建`cc = c + c`，长度加倍的数组`2n`。 

每次循环移位`c`显示为连续的长度 -`n`内段`cc`。 
5. 反转`cc`并将其与`d`使用FFT。 
6. 提取$n$对应的相关值$n$循环移位。 
7.让`best_corr`是提取的最大相关性。 
8.轮换最佳成绩`c`是$$\text{base} + \text{best\_corr}.$$### 考虑所有选择

 1. 旋转`s1`， 保持`s2`和`s3`固定的。 
2. 旋转`s2`， 保持`s1`和`s3`固定的。 
3. 旋转`s3`， 保持`s1`和`s2`固定的。 
4. 输出三个结果中的最大值。 

### 为什么它有效

 对于旋转字符串的固定选择，恒等式$$[a+b+c\ge2]
=
ab+ac+bc-2abc$$对于每个二进制三元组都是精确的。 重新组合项后，整个分数变为$$\sum ab + \sum (a\oplus b)c.$$第一个总和是常数。 第二个和正是两个二进制数组之间的循环相关。 FFT 同时计算每个移位的相关性，因此最大的相关性对应于最佳旋转。 评估旋转字符串的所有三种选择可以保证找到全局最优值。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

def fft(a, invert):
    n = len(a)
    j = 0

    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit

        if i < j:
            a[i], a[j] = a[j], a[i]

    length = 2
    while length <= n:
        ang = 2.0 * math.pi / length
        if not invert:
            ang = -ang

        wlen = complex(math.cos(ang), math.sin(ang))

        for i in range(0, n, length):
            w = 1 + 0j
            half = length // 2

            for j in range(i, i + half):
                u = a[j]
                v = a[j + half] * w

                a[j] = u + v
                a[j + half] = u - v

                w *= wlen

        length <<= 1

    if invert:
        for i in range(n):
            a[i] /= n

def convolution(a, b):
    n = 1
    need = len(a) + len(b) - 1

    while n < need:
        n <<= 1

    fa = [complex(x, 0) for x in a] + [0j] * (n - len(a))
    fb = [complex(x, 0) for x in b] + [0j] * (n - len(b))

    fft(fa, False)
    fft(fb, False)

    for i in range(n):
        fa[i] *= fb[i]

    fft(fa, True)

    return [int(round(x.real)) for x in fa[:need]]

def solve_one(x, y, rot):
    n = len(x)

    base = 0
    d = [0] * n

    for i in range(n):
        a = x[i]
        b = y[i]

        if a and b:
            base += 1

        d[i] = a ^ b

    doubled = rot + rot

    conv = convolution(d, doubled[::-1])

    best = 0

    for shift in range(n):
        idx = n - 1 + (n - 1 - shift)
        best = max(best, conv[idx])

    return base + best

def main():
    t = int(input())

    ans = []

    for _ in range(t):
        n = int(input())

        s1 = [int(c) for c in input().strip()]
        s2 = [int(c) for c in input().strip()]
        s3 = [int(c) for c in input().strip()]

        res = 0

        res = max(res, solve_one(s2, s3, s1))
        res = max(res, solve_one(s1, s3, s2))
        res = max(res, solve_one(s1, s2, s3))

        ans.append(str(res))

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    main()
```功能`solve_one`假设允许一根特定的弦旋转。 另外两个字符串被转换为常量部分和 XOR 数组。 之后，问题就变成了循环相关查询。 

双倍数组`rot + rot`是循环移位的标准技巧。 每次旋转都显示为长度-`n`这个双重序列内的窗口。 

卷积使用 FFT 同时计算所有相关性。 由于 FFT 使用浮点值，因此所得系数将四舍五入到最接近的整数。 

索引提取是最容易出错的部分。 的卷积为`d`和`reverse(rot + rot)`产生所有对齐。 系数$$n-1+(n-1-\text{shift})$$正好对应我们需要的循环移位。 

## 工作示例

 ### 示例 1```
n = 10
s1 = 0000001000
s2 = 0000000110
s3 = 0000000001
```旋转`s3`。 

| 职位| s1 | s2 | 异或（s1，s2）|
 | ---| ---| ---| ---|
 | 6 | 1 | 0 | 1 |
 | 7 | 0 | 1 | 1 |
 | 8 | 0 | 1 | 1 |

 XOR 数组包含三个独立的数组。 旋转`s3`可以对齐其单个`1`正是其中之一。 

| 班次| 相关性|
 | ---| ---|
 | 最佳班次| 1 |`base = 0`，所以答案就变成了`1`。 

这个例子表明，当只有一个字符串贡献一个`1`，最好的可能结果完全由 XOR 位置决定。 

### 示例 2```
n = 10
s1 = 0000001000
s2 = 0000010000
s3 = 0000001100
```对于旋转的选择`s3`:

 | 职位| s1 | s2 | 异或|
 | ---| ---| ---| ---|
 | 5 | 0 | 1 | 1 |
 | 6 | 1 | 0 | 1 |

 | 班次| 相关性|
 | ---| ---|
 | 最佳班次| 2 |`base = 0`，所以答案是`2`。 

这表明 FFT 正在寻找 XOR 模式和旋转字符串之间的最大重叠。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n \log n)$| 每个测试用例三个基于 FFT 的相关性 |
 | 空间|$O(n)$| FFT 数组和临时缓冲区 |

 由于所有字符串长度的总和最多为$10^5$，总 FFT 工作负载仍然在限制范围内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    from solution import main

    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    main()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out.getvalue().strip()

# provided samples
assert run(
"""3
10
0000001000
0000000110
0000000001
10
0000001000
0000010000
0000001100
10
0000000111
0000000011
0001000000
"""
) == "1\n2\n3"

# minimum size
assert run(
"""1
1
0
0
0
"""
) == "0"

# all equal
assert run(
"""1
5
11111
11111
11111
"""
) == "5"

# single useful rotation
assert run(
"""1
4
1000
0000
0001
"""
) == "1"

# boundary alignment
assert run(
"""1
4
1000
0100
0010
"""
) == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单位置，全零 | 0 | 最小尺寸 |
 | 三合一弦| 5 | 已经最优 |
 | 一场轮换比赛 | 1 | 循环班次处理|
 | 靠近两端的| 1 | 环绕正确性 |

 ## 边缘情况

 考虑：```
n = 1
s1 = 0
s2 = 0
s3 = 0
```没有旋转会改变任何事情。 异或数组是`[0]`，相关性为`0`，答案仍然是`0`。 

考虑：```
n = 4
s1 = 1000
s2 = 0000
s3 = 0001
```异或数组是`[1,0,0,0]`。 旋转`s3`一步移动其`1`进入第一个位置，产生相关性`1`。 该算法通过从卷积中提取的循环相关性来找到这一点。 

考虑：```
n = 5
s1 = 11111
s2 = 11111
s3 = 00000
```这里`base = 5`因为每个位置已经包含两个。 XOR 数组全为零，因此每个相关性都为零。 算法返回`5`，正确认识到任何旋转都不会提高或损害分数。 

这些情况涵盖最小长度、环绕对齐以及在应用任何旋转之前答案已固定的情况。
