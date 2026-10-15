---
title: "CF 106102E - 铅笔"
description: "盒子是一个 M × N 的网格。 第 i 行 j 列的单元格包含一支长度为 i · N + j 的铅笔。 行和列的索引为零，因此左上角的单元格包含长度 0。对于每个测试用例，我们都会给出 M、N 和目标长度 L。"
date: "2026-06-25T11:49:22+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106102
codeforces_index: "E"
codeforces_contest_name: "AGM 2025, Final Round, Day 1"
rating: 0
weight: 106102
solve_time_s: 65
verified: true
draft: false
---

[CF 106102E - 铅笔](https://codeforces.com/problemset/problem/106102/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 盒子是一个`M × N`网格。 所在行的单元格`i`和列`j`包含一支铅笔，其长度为`i · N + j`。 行和列的索引为零，因此左上角的单元格包含长度`0`。 

对于每个测试用例，我们都会给出`M`,`N`，和目标长度`L`。 我们可以选择网格的任何轴对齐的子矩形，并将其中的所有铅笔连接在一起。 生成的铅笔的总长度是该子矩形内所有值的总和。 

任务是找到一个子矩形，其总和恰好为`L`。 如果存在多个这样的矩形，我们必须输出尽可能小的面积。 如果没有矩形有和`L`，我们输出`-1`。 

尺寸可以大到`10^6`， 尽管`L`可以达到`10^12`。 对位置或矩形大小进行强力扫描是完全不可能的。 即使迭代所有行或所有列也已经太大了。 

关键的观察结果是网格值形成了非常规则的算术结构。 我们可以推导出任意矩形之和的封闭公式，并将问题转换为对除数的数论搜索，而不是搜索位置`2L`。 

一个常见的错误是假设只有矩形尺寸很重要。 具有相同高度和宽度的两个矩形可以具有不同的总和，因为它们的起始位置不同。 

考虑：```
M = 3, N = 3

0 1 2
3 4 5
6 7 8
```一个`1 × 2`矩形可以有和`1`,`3`,`5`,`7`,`9`,`11`。 

尺寸本身并不能决定总和。 

当计算的起始位置落在网格之外时，会出现另一种微妙的情况。```
M = 2, N = 3, L = 8
```长方形的面积`4`存在并且有效，但是一些代数上有效的解决方案对应于超出允许范围的左上角。 仍然必须检查几何边界。 

## 方法

 强力解决方案将枚举每个子矩形并计算其总和。 

有`O(M²N²)`子矩形。 尺寸可达`10^6`，那就是无望了。 甚至存储网格也是不可能的。 

网格的结构拯救了我们。 每个值都是```
value(i, j) = iN + j
```假设一个矩形开始于`(r, c)`并且有高度`h`和宽度`w`。 

其面积为```
A = h · w
```对算术级数求和得出```
sum = A · ( N(2r + h - 1) + (2c + w - 1) ) / 2
```定义```
B = N(h - 1) + (w - 1)
x = Nr + c
```然后```
sum = A(2x + B)/2
```对于目标值`L`:```
2L = A(2x + B)
```这立即意味着该区域`A`必须划分`2L`。 

这完全改变了问题。 我们不是在巨大的网格中搜索位置，而是枚举除数`2L`。 一个数的约数个数可达`2 · 10^12`只有几千。 

对于候选区域`A`，我们尝试每一个因式分解```
A = h · w
```和`h ≤ M`和`w ≤ N`。 

重新整理方程给出```
x = (2L/A - B)/2
```如果`x`是一个非负整数，我们恢复```
r = x // N
c = x % N
```并简单地验证```
r ≤ M - h
c ≤ N - w
```如果任何因式分解有效，则面积`A`是可以实现的。 由于我们按升序测试区域，因此第一个有效的区域就是答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(M²N²) | O(1) | O(1) | 太慢了 |
 | 最佳 | 大约为 O(d²)，其中 d 是 2L | 的约数数 O(d) | 已接受 |

 ## 算法演练

 1. 计算`S = 2L`。 
2. 因式分解`S`。 
3. 生成 的所有约数`S`并按升序对它们进行排序。 
4. 对于每个除数`A`的`S`，将其视为候选矩形区域。 
5. 枚举每个因式分解`A = h · w`。 
6. 跳过任何对`h > M`或者`w > N`。 
7. 计算```
Q = S / A
B = N(h - 1) + (w - 1)
```8. 检查是否```
Q - B
```是非负且均匀的。 

否则对应的起始位置不能是整数。 
9. 恢复```
x = (Q - B)/2
r = x // N
c = x % N
```10. 验证矩形是否合适：```
r ≤ M - h
c ≤ N - w
```11. 一旦找到一个有效的矩形，就输出`A`。 
12.如果没有区域有效，则输出`-1`。 

### 为什么它有效

 总和公式```
L = A(2x + B)/2
```是每个矩形的精确表征。 

对于固定的高度和宽度，数量`B`是固定的。 唯一剩下的自由是起始位置，由`x = Nr + c`。 

重新排列方程给出了唯一的候选值`x`。 如果该值不是有效的网格位置，则具有这些尺寸的矩形无法生成目标总和。 如果有效，则对应的矩形准确生成`L`。 

该算法检查每个可能的区域划分`2L`以及该区域的每一个可能的分解。 由于每个有效矩形都必须满足这些条件，因此不能错过任何解决方案。 按升序测试区域可确保第一个有效区域具有最小面积。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def factorize(x):
    fac = []
    d = 2

    while d * d <= x:
        if x % d == 0:
            cnt = 0
            while x % d == 0:
                x //= d
                cnt += 1
            fac.append((d, cnt))
        d += 1 if d == 2 else 2

    if x > 1:
        fac.append((x, 1))

    return fac

def gen_divisors(factors, idx=0, cur=1, out=None):
    if out is None:
        out = []

    if idx == len(factors):
        out.append(cur)
        return out

    p, e = factors[idx]
    val = 1

    for _ in range(e + 1):
        gen_divisors(factors, idx + 1, cur * val, out)
        val *= p

    return out

t = int(input())

for _ in range(t):
    M, N, L = map(int, input().split())

    S = 2 * L

    factors = factorize(S)
    divisors = gen_divisors(factors)
    divisors.sort()

    answer = -1

    for A in divisors:
        found = False

        for h in divisors:
            if h * h > A:
                break

            if A % h:
                continue

            w = A // h

            for hh, ww in ((h, w), (w, h) if h != w else ()):
                if hh > M or ww > N:
                    continue

                Q = S // A
                B = N * (hh - 1) + (ww - 1)

                diff = Q - B

                if diff < 0 or diff & 1:
                    continue

                x = diff // 2

                r = x // N
                c = x % N

                if r <= M - hh and c <= N - ww:
                    answer = A
                    found = True
                    break

            if found:
                break

        if found:
            break

    print(answer)
```第一部分因式分解`2L`。 从该因式分解中，我们生成所有除数。 

外循环按升序测试候选区域。 由于我们只关心最小的可行区域，因此当找到有效矩形时，搜索可以立即停止。 

对于每个区域，我们枚举所有因子对`(h, w)`。 代数给出了唯一可能的起始索引`x`。 转换```
x = Nr + c
```回到`(r, c)`使用整数除法和余数很简单。 

最常见的实施错误是忘记几何检查```
r ≤ M - h
c ≤ N - w
```值为`x`可以满足方程但仍然对应于延伸到盒子之外的矩形。 

## 工作示例

 ### 示例 1

 输入：```
M = 2, N = 3, L = 8
```最小有效面积为`4`。 

| 一个 | 小时 | 瓦 | 问 | 乙| x| r | c | 有效 |
 | ---| ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 1 | 16 | 16 0 | 8 | 2 | 2 | 没有 |
 | 2 | 1 | 2 | 8 | 1 | 无效| - | - | 没有 |
 | 4 | 2 | 2 | 4 | 4 | 0 | 0 | 0 | 是的 |

 矩形是：```
0 1
3 4
```其总和是`8`。 

### 示例 2

 输入：```
M = 3, N = 3, L = 36
```| 一个 | 小时 | 瓦 | 问 | 乙| x| r | c | 有效 |
 | ---| ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 1 | 72 | 72 0 | 36 | 36 出 | - | 没有 |
 | 3 | 1 | 3 | 24 | 2 | 11 | 11 出 | - | 没有 |
 | 9 | 3 | 3 | 8 | 8 | 0 | 0 | 0 | 是的 |

 选择整个网格：```
0 1 2
3 4 5
6 7 8
```它的总和是`36`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(d²) |`d`是的约数`2L`|
 | 空间| O(d) | 存储除数 |

 对于最多的数字`2 · 10^12`，在最坏的情况下除数计数只有几千。 与网格尺寸相比，这很小，网格尺寸可能达到`10^6`。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def factorize(x):
        fac = []
        d = 2
        while d * d <= x:
            if x % d == 0:
                c = 0
                while x % d == 0:
                    x //= d
                    c += 1
                fac.append((d, c))
            d += 1 if d == 2 else 2
        if x > 1:
            fac.append((x, 1))
        return fac

    def gen(fac, i=0, cur=1, out=None):
        if out is None:
            out = []
        if i == len(fac):
            out.append(cur)
            return out
        p, e = fac[i]
        v = 1
        for _ in range(e + 1):
            gen(fac, i + 1, cur * v, out)
            v *= p
        return out

    t = int(input())
    ans = []

    for _ in range(t):
        M, N, L = map(int, input().split())
        S = 2 * L

        divs = gen(factorize(S))
        divs.sort()

        res = -1

        for A in divs:
            ok = False

            for h in divs:
                if h * h > A:
                    break
                if A % h:
                    continue

                w = A // h

                pairs = [(h, w)]
                if h != w:
                    pairs.append((w, h))

                for hh, ww in pairs:
                    if hh > M or ww > N:
                        continue

                    Q = S // A
                    B = N * (hh - 1) + (ww - 1)

                    diff = Q - B

                    if diff < 0 or diff % 2:
                        continue

                    x = diff // 2
                    r = x // N
                    c = x % N

                    if r <= M - hh and c <= N - ww:
                        res = A
                        ok = True
                        break

                if ok:
                    break

            if ok:
                break

        ans.append(str(res))

    return "\n".join(ans)

# sample-style cases
assert solve("1\n2 3 8\n") == "4"

# minimum grid
assert solve("1\n1 1 1\n") == "-1"

# whole grid
assert solve("1\n3 3 36\n") == "9"

# single cell exists
assert solve("1\n2 2 3\n") == "1"

# impossible target
assert solve("1\n3 3 10\n") == "-1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 1`|`-1`| 单元格值 1 不存在 |
 |`3 3 36`|`9`| 全网格解决方案|
 |`2 2 3`|`1`| 单细胞矩形|
 |`3 3 10`|`-1`| 没有匹配的矩形 |

 ## 边缘情况

 考虑：```
1
1 1 1
```网格仅包含一个值：```
0
```算法测试区`1`，计算对应的位置，发现没有一个矩形可以和`1`。 它输出`-1`。 

考虑：```
1
2 2 3
```细胞`(1,0)`包含价值`2`， 和`(1,1)`包含价值`3`。 

对于面积`1`，公式给出了与值精确对应的有效起始位置`3`。 算法立即返回`1`，这是最优的。 

考虑：```
1
2 3 8
```A careless implementation might find an algebraic solution whose top-left corner lies outside the grid. 重建步骤```
r = x // N
c = x % N
```其次是```
r ≤ M - h
c ≤ N - w
```消除了这些误报并仅保留几何上有效的矩形。
