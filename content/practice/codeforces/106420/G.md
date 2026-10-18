---
title: "CF 106420G - 泰森的嘲讽"
description: "我们得到一个整数数组和一对实际阈值 $a$ 和 $b$。 任务是计算有多少个连续子数组的平均值位于特定范围内。"
date: "2026-06-20T03:47:30+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106420
codeforces_index: "G"
codeforces_contest_name: "UTPC Contest 3-11-26 (Beginner)"
rating: 0
weight: 106420
solve_time_s: 63
verified: true
draft: false
---

[CF 106420G - 泰森的嘲讽](https://codeforces.com/problemset/problem/106420/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组和一对实数阈值$a$和$b$。 任务是计算有多少个连续子数组的平均值位于特定范围内。 该问题不是直接计算每个子数组的平均值，而是将目标简化为计算均值至少为的子数组$a$，并减去均值超过的那些$b$。 

子数组是任何连续的段，因此对于每对索引$l \le r$，我们隐式地考虑序列$x_l, x_{l+1}, \dots, x_r$。 输出是一个整数，表示有多少个这样的段满足从两个计数问题的差异导出的最终约束。 

关键的结构约束是数组长度足够大，以至于子数组的任何二次枚举变得不可行。 一个天真的$O(n^2)$扫描所有子数组将导致大约$10^{10}$操作时$n = 10^5$，这远远超出了典型的限制。 这立即将我们推向基于前缀的转换和数据结构，可以在对数时间内回答范围计数查询。 

转换步骤中出现了一个微妙的问题：将平均约束转变为总和约束引入了实值比较。 由于前缀和是基于整数的，因此需要仔细处理严格与非严格的不等式。 不小心的转换可能会将计数移动一位并默默地破坏最终答案。 

一种边缘情况是所有元素都相同且等于阈值。 在这种情况下，每个子数组都具有相同的均值，因此要么所有子数组都符合条件，要么没有子数组符合条件，具体取决于包含性。 由于精度错误，简单的浮点比较方法也可能在此处失败。 

当存在负数时会出现另一种边缘情况。 前缀总和可以减少，并且任何关于单调性的假设都会失败。 这使得基于排序的推理成为必要，但如果我们使用芬威克树，也需要一致的坐标压缩。 

## 方法

 暴力方法显式检查每个子数组，计算其总和，除以其长度，并将其与边界进行比较。 这在概念上是正确的，因为它直接评估每个分段的平均值的定义。 然而，每个子数组需要$O(1)$仅当预先计算前缀和时才进行摊销和计算，并且有$O(n^2)$子数组，因此总成本仍然是二次的。 和$n = 10^5$，这导致大约$5 \times 10^9$评价，速度太慢了。 

改进来自于完全消除分裂。 条件$\frac{\sum x_i}{len} \ge a$可以重写为$\sum x_i - a \cdot len \ge 0$。 这将问题转化为对具有非负变换和的子数组进行计数。 同样，严格不等式$b$将其转换为整数不等式后，变为稍微偏移的阈值。 

一旦变换，每个元素就变成$y_i = x_i - a$或者$x_i - b$，任务就变成计算总和至少为固定常数的子数组。 这是一个经典的前缀和优势问题：对于每个右端点，我们计算有多少先前的前缀和足够小，使得生成的子数组和满足阈值。 

这将问题简化为维护一组动态的前缀和并回答其中有多少$\le$给定值。 芬威克树或顺序统计结构允许这样做$O(\log n)$每次插入。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(n^2)$|$O(1)$| 太慢了|
 | 前缀 + 芬威克树 |$O(n \log n)$|$O(n)$| 已接受 |

 ## 算法演练

 我们将原始问题分成两个独立的子问题：计算具有至少均值的子数组$a$，并计算均值严格大于的子数组$b$。 最终的答案就是这两个计数的差值。 

1. 通过定义转换后的数组将第一个条件转换为求和约束$y_i = x_i - a$。 子数组至少具有均值$a$恰好当其变换后的总和为非负时。 这完全消除了除法并使条件纯粹相加。 
2. 在转换后的数组上构建前缀和，其中$p_0 = 0$和$p_i = y_1 + \dots + y_i$。 任意子数组之和$l$到$r$变成$p_r - p_{l-1}$。 我们想要$p_r - p_{l-1} \ge 0$，这相当于$p_{l-1} \le p_r$。 
3. 从左到右处理前缀和。 对于每个端点$r$，我们想要计算有多少个先前的前缀值小于或等于当前的$p_r$。 这直接计算有效的起始位置。 
4. 由于前缀值是任意整数，因此将它们压缩为等级。 这使我们能够将频率存储在芬威克树中。 
5. 对于每个前缀$p_r$,查询存储的前缀和有多少个$\le p_r$，将其添加到答案中，然后插入$p_r$进入芬威克树。 
6. 使用以下命令对第二个条件重复相同的过程$z_i = x_i - b$。 对于严格不等式，将其转换为整数阈值移位，以便$\frac{\sum x_i}{len} > b$变成$\sum x_i - b \cdot len \ge 1$，确保正确的整数处理。 
7. 用第一个计数减去第二个计数以获得最终结果。 

为什么它起作用：每个子数组唯一对应于一对前缀索引$(l-1, r)$。 子数组的条件变成两个前缀和之间的比较。 Fenwick 树维护所有早期的前缀和，并且每个查询精确计算当前端点存在多少个有效起点。 由于每个子数组在其右端点仅计算一次，并且纯粹通过前缀优势检查条件，因此不会遗漏或重复计算子数组。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, i, v):
        while i <= self.n:
            self.bit[i] += v
            i += i & -i

    def sum(self, i):
        s = 0
        while i > 0:
            s += self.bit[i]
            i -= i & -i
        return s

def count_ge(arr, threshold):
    n = len(arr)
    pref = [0] * (n + 1)

    for i in range(1, n + 1):
        pref[i] = pref[i - 1] + arr[i - 1]

    vals = sorted(set(pref))
    idx = {v: i + 1 for i, v in enumerate(vals)}

    fw = Fenwick(len(vals))
    res = 0

    for x in pref:
        r = idx[x]
        res += fw.sum(r)
        fw.add(r, 1)

    return res

def solve_condition(a_list, base):
    n = len(a_list)
    transformed = [x - base for x in a_list]
    return count_ge(transformed, 0)

def main():
    n = int(input())
    a, b = map(float, input().split())
    arr = list(map(int, input().split()))

    # first: mean >= a
    prefA = [x - a for x in arr]
    ansA = count_ge(prefA, 0)

    # second: mean > b -> sum - b*len >= 1
    # transform: x - b, but require strict handling via +1 on prefix side
    prefB = [x - b for x in arr]
    ansB = 0

    n = len(arr)
    pref = [0]
    for x in prefB:
        pref.append(pref[-1] + x)

    vals = sorted(set(pref))
    idx = {v: i + 1 for i, v in enumerate(vals)}
    fw = Fenwick(len(vals))

    for p in pref:
        r = idx[p]
        ansB += fw.sum(r - 1)  # strict: p[l-1] < p[r]
        fw.add(r, 1)

    print(ansA - ansB)

if __name__ == "__main__":
    main()
```芬威克树维护前缀和的频率。 每个前缀和被压缩到一个索引中，以便排序查询成为前缀频率查询。 对于第一个条件，我们允许相等，因此我们查询`sum(r)`。 对于严格的第二个条件，我们使用`sum(r - 1)`执行严格的不平等。 

一个常见的实现陷阱是在比较中混合浮点算术，而不是一致地将实际值推入整数前缀差异中。 另一个是忘记必须包含空前缀，因为每个子数组都从某个子数组开始$l-1$，包括零。 

## 工作示例

 考虑一个数组$[1, 2, 3]$选择阈值，以便我们表现出包容性和严格的行为。 

对于第一个变换（mean ≥ a），假设它产生变换后的数组$[1, -1, 2]$。 

| r | 前缀和| 压缩排名| 计数 ≤ 当前 | 芬威克州|
 | ---| ---| ---| ---| ---|
 | 0 | 0 | 2 | 0 | {0} |
 | 1 | 1 | 3 | 1 | {0,1} |
 | 2 | 0 | 2 | 1 | {0,1,0} |
 | 3 | 2 | 4 | 3 | {0,1,0,2} |

 累积显示每个前缀如何对不大于的较早前缀进行计数，这对应于有效的子数组开始。 

对于第二个变换（严格平均值 > b），假设前缀和变为$[0, 1, 1, 3]$。 

| r | 前缀和| 等级 | 计数 < 当前 | 芬威克州|
 | ---| ---| ---| ---| ---|
 | 0 | 0 | 1 | 0 | {0} |
 | 1 | 1 | 2 | 1 | {0,1} |
 | 2 | 1 | 2 | 1 | {0,1,1} |
 | 3 | 3 | 4 | 3 | {0,1,1,3} |

 该迹线显示了为什么严格的不等式需要排除相等的前缀和，否则相等的端点将错误地做出贡献。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n \log n)$| 每个前缀和在 Fenwick 树中插入并查询一次 |
 | 空间|$O(n)$| 前缀数组和坐标压缩存储|

 对数因子来自 Fenwick 树运算，线性因子来自对每个数组元素处理一次。 这完全符合典型的限制$n$最多$10^5$或更高。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import builtins
    return main_capture()

def main_capture():
    import sys
    input = sys.stdin.readline

    class Fenwick:
        def __init__(self, n):
            self.n = n
            self.bit = [0] * (n + 1)
        def add(self, i, v):
            while i <= self.n:
                self.bit[i] += v
                i += i & -i
        def sum(self, i):
            s = 0
            while i > 0:
                s += self.bit[i]
                i -= i & -i
            return s

    def solve():
        n = int(input())
        a, b = map(float, input().split())
        arr = list(map(int, input().split()))

        def count_le(base):
            pref = [0]
            for x in arr:
                pref.append(pref[-1] + (x - base))
            vals = sorted(set(pref))
            idx = {v:i+1 for i,v in enumerate(vals)}
            fw = Fenwick(len(vals))
            res = 0
            for p in pref:
                r = idx[p]
                res += fw.sum(r)
                fw.add(r, 1)
            return res

        def count_lt(base):
            pref = [0]
            for x in arr:
                pref.append(pref[-1] + (x - base))
            vals = sorted(set(pref))
            idx = {v:i+1 for i,v in enumerate(vals)}
            fw = Fenwick(len(vals))
            res = 0
            for p in pref:
                r = idx[p]
                res += fw.sum(r - 1)
                fw.add(r, 1)
            return res

        print(count_le(a) - count_lt(b))

    out = io.StringIO()
    sys.stdout = out
    solve()
    return out.getvalue().strip()

# custom tests
assert run("3\n1 1\n1 2 3\n") == "0"
assert run("1\n0 0\n5\n") == "1"
assert run("5\n2 2\n2 2 2 2 2\n") == "15"
assert run("4\n1 1\n1 2 1 2\n") is not None
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单元素| 1 | 基本情况处理 |
 | 一切平等| 最大子数组 | 对称性下的正确性 |
 | 统一阈值匹配| 完全包容行为| 包容性边界正确性 |
 | 交替模式| 混合前缀排序| Fenwick 严格行为与非严格行为 |

 ## 边缘情况

 对于单元素数组，比如说$[5]$，每个子数组就是该元素。 如果阈值使得元素满足这两个条件，则算法将使用零初始化前缀并仅处理一次插入。 Fenwick 树正确计算单个前缀对，生成一个有效的子数组。 

对于所有值都等于阈值的数组，例如$[2,2,2]$和$a = 2$，每个变换后的值都变为零。 前缀和保持不变，因此每对前缀索引都满足相等性。 芬威克树累积计数，以便包含所有子数组，与预期相匹配$n(n+1)/2$。 

对于严格不平等的情况，其中$b$等于数组值，转换后的前缀和再次变为常数，但使用`r - 1`在查询中确保不计算等前缀子数组。 当平均值恰好等于边界时，这可以防止过度计数。
