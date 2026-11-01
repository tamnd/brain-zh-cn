---
title: "CF 1654E - 算术运算"
description: "我们希望更改尽可能少的数组元素，以便最终的数组成为算术级数。 算术级数完全由两个参数决定：它的第一个值和它的公差。"
date: "2026-06-10T03:43:20+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "graphs", "math"]
categories: ["algorithms"]
codeforces_contest: 1654
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 778 (Div. 1 + Div. 2, based on Technocup 2022 Final Round)"
rating: 2300
weight: 1654
solve_time_s: 160
verified: true
draft: false
---

[CF 1654E - 算术运算](https://codeforces.com/problemset/problem/1654/E)

 **评分：** 2300
 **标签：** 暴力破解、数据结构、图表、数学
 **求解时间：** 2m 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们希望更改尽可能少的数组元素，以便最终的数组成为算术级数。 

算术级数完全由两个参数决定：它的第一个值和它的公差。 如果我们将级数写为$$a_i = b + d \cdot i$$那么每个已经满足这个公式的位置都可以保持不变，而每个不满足这个公式的位置都必须修改。 

这将问题转化为最大化问题。 我们不是直接最小化变化的数量，而是寻找已经与最大数量的位置匹配的算术级数。 如果该进展匹配$k$位置，然后剩余的$n-k$立场必须改变。 

数组长度可以达到$10^5$，这立即排除了任何接近$O(n^2)$。 二次算法的执行大致如下$10^{10}$操作，远远超出极限。 我们周围需要一些东西$O(n\sqrt n)$或者$O(n \log n)$。 

一些边缘情况使幼稚的推理变得危险。 

考虑```
3
5 5 5
```该数组已经是一个具有公差的算术级数$0$。 答案是$0$。 任何仅检查非零差异的解决方案都会在这里失败。 

考虑```
4
1 100000 1 100000
```最佳级数可能具有非常大的正公差或负公差。 将搜索限制在较小的差异范围内会错过有效的答案。 

考虑```
1
42
```单个元素始终是算术级数。 答案一定是$0$。 

最微妙的问题来自于价值界限。 每个原始值都介于$1$和$100000$，但目标进度可能包含负数或大于$100000$。 解决方案必须仅推理哪些现有点已经位于级数上，而不是最终级数的范围。 

## 方法

 一个有用的几何视图是将每个数组元素视为一个点$(i,a_i)$。 

算术级数的形式为$$a_i=b+d\,i$$这正是直线方程。 问题变成：

 找到一条经过最多点数的线$(i,a_i)$。 

如果一行包含$k$点，那些$k$位置已经与该线代表的进展相匹配。 

蛮力的想法很简单。 选取每一对点，确定穿过它们的唯一线，并计算该线上有多少个点。 最好的线路给出了答案。 

这是正确的，因为每个算术级数对应于一条线，并且每条线都由两个点确定。 

问题是成本。 有$O(n^2)$对，甚至存储或计数它们都变得不可能$n=10^5$。 

关键观察来自边界$a_i \le 100000$。 

让$B \approx \sqrt{100000}$， 关于$320$。 

我们分裂共同点$d$分为两类。 

对于小斜坡，$|d| \le B$，大约只有$2B+1$可能的值。 对于固定的$d$,$$a_i = b + d i$$意味着$$b = a_i - d i.$$同一级数上的所有点都有差异$d$具有相同的值$a_i-di$。 我们可以统计出现的频率$a_i-di$对于每一个小$d$。 

对于大斜坡，$|d| > B$，一些特别的事情发生了。 由于所有原始值都位于$[1,100000]$,$$|a_j-a_i| \le 100000.$$如果两个点属于一个级数$|d|>B$， 然后$$|j-i| \le \frac{100000}{|d|} < \frac{100000}{B}.$$选择$B \approx \sqrt{100000}$使得这个距离最多约为$320$。 

因此，属于大斜率级数的每一对点的索引必须接近。 我们只需要检查一个短的长度窗口$B$每个位置之前。 

这将问题转化为$O(nB)$solution, which is fast enough.

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(n^2)$或者更糟|$O(n^2)$| Too slow |
 | 最佳 |$O(n\sqrt A)$， 在哪里$A=100000$|$O(\sqrt A)$平均哈希使用量 | 已接受 |

 ## 算法演练

 1. 让$B=\lfloor\sqrt{100000}\rfloor+1$。 
2. 维护`best`，已经位于公共算术级数上的最大位置数。 
3. Handle all small differences$|d|\le B$。 

对于每个整数$d$在该范围内，计算$$a_i-di$$对于每个位置$i$。 

属于同一级数且有共同差异的职位$d$产生相同的价值。 使用哈希图计算频率并更新`best`。 
4. 处理所有较大的差异$|d|>B$。 

对于每个起始索引$i$, 仅检查位置$$j=i+1,\dots,\min(n-1,i+B).$$任何包含两者的有效大坡度级数$i$和$j$必须满足$$a_j-a_i=d(j-i).$$如果$(a_j-a_i)$可以整除$(j-i)$，计算整数斜率$$d=\frac{a_j-a_i}{j-i}.$$5. 忽略斜坡$|d|\le B$，因为它们已经被处理过。 
6. 对于剩余的斜坡，计算附近有多少个点产生相同的斜坡$d$具有固定的起始索引$i$。 

如果出现斜坡$c$次，则对应行包含$c+1$点包括$i$。 

更新`best`。 
7. 答案是$$n-\text{best}.$$### 为什么它有效

 每个等差数列对应一条线$a_i=b+di$。 

小斜率阶段明确检查每个可能的斜率$|d|\le B$。 对于固定斜率，当点共享相同的截距值时，它们恰好位于相同的级数上$a_i-di$，因此频率计数给出了匹配位置的准确数量。 

对于大斜率，值界限强制任何两个匹配点的索引接近。 最大可能的指数差距小于$100000/B$，这最多是$B$。 因此，属于大斜率级数的每一对点都是在局部窗口内发现的。 当处理该级数上的最小索引时，级数上的所有其他点贡献相同的斜率$d$，并且计数恢复了级数的确切大小。 

由于每个可能的级数都属于小斜率或大斜率类别，因此该算法会找到未改变位置的最大数量。 最小修改次数是该最大修改次数的补集。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    if n <= 2:
        print(0)
        return

    MAX_A = 100000
    B = int(MAX_A ** 0.5) + 1

    best = 1

    # Small slopes: |d| <= B
    for d in range(-B, B + 1):
        freq = {}
        cur_best = 0

        for i, x in enumerate(a):
            key = x - d * i
            val = freq.get(key, 0) + 1
            freq[key] = val
            if val > cur_best:
                cur_best = val

        if cur_best > best:
            best = cur_best

    # Large slopes: |d| > B
    for i in range(n):
        cnt = {}

        limit = min(n, i + B + 1)

        for j in range(i + 1, limit):
            diff = a[j] - a[i]
            dist = j - i

            if diff % dist != 0:
                continue

            d = diff // dist

            if -B <= d <= B:
                continue

            cnt[d] = cnt.get(d, 0) + 1

        for c in cnt.values():
            if c + 1 > best:
                best = c + 1

    print(n - best)

if __name__ == "__main__":
    solve()
```第一阶段列举了每一个微小的共同差异。 每一件的数量`a[i] - d * i`充当线的截距。 截距相等意味着对应的点已经位于相同的等差级数上。 

第二阶段是利用价值界限的阶段。 对于固定位置`i`，只有下一个`B`需要检查指标。 任何具有较大斜率的级数都不能延伸得比该斜率更远，因为原始值被限制在一定的宽度范围内`100000`。 

一个常见的实现错误是忘记数学推导中的索引是从 1 开始的，而 Python 使用从 0 开始的索引。 表达式`a[i] - d * i`与基于 0 的索引完美配合，因为用常量更改所有索引只会改变截距，不会影响相等性。 

另一个容易犯的错误是计算全球范围内的大坡度。 必须为每个起始索引重建哈希映射`i`。 否则，具有相同斜率的不相关线会混合在一起。 

## 工作示例

 ### 示例 1

 输入：```
9
3 2 7 8 6 9 5 4 1
```最佳进展之一是：$$11,10,9,8,7,6,5,4,3$$具有共同差异$-1$。 

为了$d=-1$, 计算$a_i-di=a_i+i$。 

| 我| 一个[我] | a[i] + 我 |
 | ---| ---| ---|
 | 0 | 3 | 3 |
 | 1 | 2 | 3 |
 | 2 | 7 | 9 |
 | 3 | 8 | 11 | 11
 | 4 | 6 | 10 | 10
 | 5 | 9 | 14 | 14
 | 6 | 5 | 11 | 11
 | 7 | 4 | 11 | 11
 | 8 | 1 | 9 |

 最高频率为 3，来自截距值 9 和 11。 

其他坡度也进行了检查。 找到的最大直线包含 3 个点，因此：

 | 数量 | 价值|
 | ---| ---|
 | n | 9 |
 | 最好的| 3 |
 | 答案| 6 |

 该轨迹显示了算法如何搜索所有可能的斜率并保留最大组的已正确位置。 

### 示例 2

 考虑```
5
1 3 5 7 9
```为了$d=2$：

 | 我| 一个[我] | a[i] - 2i | a[i] - 2i |
 | ---| ---| ---|
 | 0 | 1 | 1 |
 | 1 | 3 | 1 |
 | 2 | 5 | 1 |
 | 3 | 7 | 1 |
 | 4 | 9 | 1 |

 每个值都是相同的。 

| 数量 | 价值|
 | ---| ---|
 | n | 5 |
 | 最好的| 5 |
 | 答案| 0 |

 整个数组已经位于一个算术级数上。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n\sqrt{100000})$| 小坡度和大坡度各有表现$O(nB)$工作|
 | 空间|$O(B)$平均 | 哈希映射一次存储一个斜率或一个索引窗口的计数 |

 和$B \approx 317$，总工作量大约是$10^7$操作简单，完全符合以下限制$n=10^5$。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    input_data = io.StringIO(inp)
    output = io.StringIO()

    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = input_data
    sys.stdout = output

    try:
        import math

        input = sys.stdin.readline

        n = int(input())
        a = list(map(int, input().split()))

        if n <= 2:
            print(0)
        else:
            MAX_A = 100000
            B = int(MAX_A ** 0.5) + 1

            best = 1

            for d in range(-B, B + 1):
                freq = {}
                for i, x in enumerate(a):
                    key = x - d * i
                    freq[key] = freq.get(key, 0) + 1
                    best = max(best, freq[key])

            for i in range(n):
                cnt = {}
                for j in range(i + 1, min(n, i + B + 1)):
                    diff = a[j] - a[i]
                    dist = j - i

                    if diff % dist:
                        continue

                    d = diff // dist

                    if -B <= d <= B:
                        continue

                    cnt[d] = cnt.get(d, 0) + 1

                for v in cnt.values():
                    best = max(best, v + 1)

            print(n - best)

        return output.getvalue()

    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# minimum size
assert run("1\n42\n") == "0\n"

# two elements always form an AP
assert run("2\n5 100\n") == "0\n"

# already arithmetic
assert run("5\n1 3 5 7 9\n") == "0\n"

# all equal
assert run("6\n7 7 7 7 7 7\n") == "0\n"

# one wrong element
assert run("5\n1 3 100 7 9\n") == "1\n"

# large slope progression
assert run("4\n1 100000 199999 299998\n") == "0\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 42`|`0`| 单元素数组 |
 |`2 / 5 100`|`0`| 任意两个元素形成一个AP |
 |`1 3 5 7 9`|`0`| 已经算术 |
 |`7 7 7 7 7 7`|`0`| 差异为零|
 |`1 3 100 7 9`|`1`| 需要一项修改 |
 |`1 100000 199999 299998`|`0`| 大坡度搬运|

 ## 边缘情况

 考虑```
1
42
```算法立即返回`0`因为长度为 1 的数组已经是一个算术级数。 无需进行坡度处理。 

考虑```
6
7 7 7 7 7 7
```坡度用$d=0$，每个值$a_i-di$等于$7$。 频率变为$6$， 所以`best = 6`答案是`0`。 这可以正确处理不断的进展。 

考虑```
5
1 3 100 7 9
```坡度用$d=2$，截距值为：

 | 我| a[i] - 2i | a[i] - 2i |
 | ---| ---|
 | 0 | 1 |
 | 1 | 1 |
 | 2 | 96 | 96
 | 3 | 1 |
 | 4 | 1 |

 拦截`1`出现四次，意味着进程中已经有四个位置$1,3,5,7,9$。 答案就变成了$5-4=1$。 

考虑```
4
1 100000 199999 299998
```共同的区别是$99999$，远大于$B$。 小斜率相位无法检测到它。 大斜率阶段检查附近的指数，通过整除性检查计算精确的斜率，将相等的斜率分组在一起，并恢复同一级数上的所有四个点。 答案是`0`。
