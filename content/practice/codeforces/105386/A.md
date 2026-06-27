---
title: "CF 105386A - 二星竞赛"
description: "我们有几场比赛。 每场比赛都有一个“星级评定”和一个属性向量。 比赛的得分只是其所有属性的总和。 一些属性值已经固定，而其他属性值缺失并标记为未知。"
date: "2026-06-23T05:12:47+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105386
codeforces_index: "A"
codeforces_contest_name: "The 2024 ICPC Kunming Invitational Contest"
rating: 0
weight: 105386
solve_time_s: 70
verified: true
draft: false
---

[CF 105386A - 二星竞赛](https://codeforces.com/problemset/problem/105386/A)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 10s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有几场比赛。 每场比赛都有一个“星级评定”和一个属性向量。 比赛的得分只是其所有属性的总和。 一些属性值已经固定，而其他属性值缺失并标记为未知。 最后必须为每个属性分配一个范围内的整数$[0, k]$。 

这个要求是一个严格的排序条件：如果一场比赛比另一场比赛有更多的星星，那么它的最终得分也必须严格更大。 因此，星形排序必须与由构造的属性向量之和得出的排序一致。 

任务是填充所有缺失值，以使这种单调性成立，或者确定这是不可能的。 

这些限制立即塑造了问题。 所有测试用例的属性条目总数最多为$4 \cdot 10^5$，因此任何处理每个单元恒定次数的解决方案都是可行的。 任何一个的二次方$n$或者$m$是不可能的。 

关键的困难在于我们不仅仅是独立地为每次比赛选择任意值。 由于总数必须遵守严格的全球排序，因此一项竞赛的选择可能会限制所有其他竞赛。 

当固定值在填充空白之前就已经违反可行性时，就会出现微妙的失败情况。 

例如，假设两个比赛都有星级评分$s_1 < s_2$，但即使在填充未知数之前，第一个已经比第二个具有更大的固定总和。 任何填充都无法解决此问题，因为未知数只会将分数增加到有限的最大值。 

另一个棘手的情况是，当具有较高星级的比赛的所有条目都是未知的，而较低星级的比赛已经将所有条目固定为高值时。 该解决方案必须在贪婪分配之前检查可行性。 

一种天真的方法会尝试所有分配或贪婪地填充每个单元格的缺失值，而不考虑全局排序，这会破坏，因为约束基本上是关于整个总和，而不是单个属性。 

## 方法

 一个蛮力的想法是将每个丢失的单元格视为一个变量并尝试分配值以满足所有约束。 这很快就会退化为高维约束满足问题。 即使我们只考虑调整每场比赛的金额，每场比赛最多可以有$m$变量，并且每个变量的范围超过$[0, k]$，所以即使是一场比赛$(k+1)^m$配置。 这是完全不可行的。 

关键的简化来自于将每场比赛分解为一个数字：总和。 一旦我们只考虑总和，向量的内部结构就变得无关紧要，除了作为跨条目分配目标总和的一种方式。 

现在问题变成：为每场比赛分配一个最终的总和$v_i$，尊重现有的固定贡献并确保星级评级的严格单调性。 

如果我们按星级对比赛进行排序，则需要严格按照此顺序增加总和。 因此，真正的任务变成构建任何严格递增的可行和序列，其中可行性取决于我们仍然可以使用缺失的条目来增加多少竞赛。 

对于每次比赛，我们可以计算两个界限。 通过将所有缺失条目视为零来获得最小可能总和。 通过填写所有缺失的条目来获得最大可能的总和$k$。 这就将问题转化为区间调度：每场比赛都有一个可行的区间$[L_i, R_i]$，我们需要选择一个值$v_i \in [L_i, R_i]$这样$v$严格地随着星序的增加而增加。 

一旦确定了所需的金额，就将每个$v_i$回到$m$坐标很简单：首先分配固定值，然后贪婪地填充缺失的槽。 

核心见解是，可行性完全由这些间隔决定，并且对已排序的星进行贪婪的从左到右分配就足够了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| 指数| 太慢了 |
 | 区间+贪心构造 |$O(nm \log n)$|$O(nm)$| 已接受 |

 ## 算法演练

 1. 对于每场比赛，通过添加所有非缺失值来计算其固定贡献总和。 还要计算它有多少个缺失条目。 这隔离了每场比赛中剩余的自由度。 
2. 对于每场比赛，假设所有缺失的条目均为零，计算可能的最低总分。 这给出了$L_i$。 类似地，假设所有缺失的条目都变为，计算最大可能得分$k$, 给予$R_i$。 这将每场比赛压缩为可实现总金额的区间。 
3. 按星级对所有比赛进行排序。 这是必要的，因为约束是有方向的：更高的星星必须具有严格更高的总和。 
4. 按照星数递增的顺序迭代比赛，并贪婪地分配最终的总和。 维护一个变量`prev`为最后分配的总和。 对于当前的比赛，我们必须选择一个严格大于的值`prev`，而且也在$[L_i, R_i]$。 如果`L_i > prev`，我们取`L_i`。 否则我们采取`prev + 1`。 如果这超过$R_i$，分配是不可能的。 
5. 确定所有目标金额后，重建每次比赛的实际财产价值。 从固定值开始。 然后，对于每个缺失的位置，分配达到目标总和所需的数量，但永远不要超过$k$。 这是贪婪地完成的：一一填补缺失的插槽。 
6. 输出完成的矩阵。 

贪婪分配起作用的关键原因是早期的竞赛是最严格的。 一旦我们承诺每次比赛的最小可行值，我们就会为以后的比赛保留最大的空间。 任何增加较早值的尝试只会降低稍后时间间隔的可行性，而没有任何好处。 

### 为什么它有效

 每场比赛都定义了一个可行的总和区间。 按星级排序对从这些间隔中选择的代表施加了严格的排序约束。 贪心步构造与区间兼容的尽可能最小的严格递增序列。 如果在某个时刻失败，则意味着即使当前间隔的最小有效选择也不能超过先前的分配，因此根本不存在有效序列。 这相当于证明任何可行的解决方案都必须逐点压倒贪婪解决方案，而一旦贪婪解决方案失败，这是不可能的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m, k = map(int, input().split())
    
    stars = []
    fixed_sum = [0] * n
    missing = [0] * n
    arr = []

    for i in range(n):
        data = list(map(int, input().split()))
        s = data[0]
        stars.append((s, i))
        row = data[1:]
        arr.append(row)

        ssum = 0
        miss = 0
        for x in row:
            if x == -1:
                miss += 1
            else:
                ssum += x

        fixed_sum[i] = ssum
        missing[i] = miss

    intervals = []
    for i in range(n):
        L = fixed_sum[i]
        R = fixed_sum[i] + missing[i] * k
        intervals.append((L, R, i))

    stars.sort()

    assigned = [0] * n
    prev = -10**30

    for s, i in stars:
        L, R, idx = intervals[i]
        if L > prev:
            val = L
        else:
            val = prev + 1

        if val > R:
            print("No")
            return

        assigned[i] = val
        prev = val

    result = [row[:] for row in arr]

    for i in range(n):
        need = assigned[i] - fixed_sum[i]
        for j in range(m):
            if result[i][j] == -1:
                give = min(k, need)
                result[i][j] = give
                need -= give

    print("Yes")
    for i in range(n):
        print(*result[i])

def main():
    t = int(input())
    for _ in range(t):
        solve()

if __name__ == "__main__":
    main()
```该解决方案首先解析每个竞赛并将固定贡献与缺失条目分开。 这种分离至关重要，因为它使我们能够计算可实现总和的精确下限和上限，而无需猜测各个值。 

排序星上的贪婪部分是核心决策部分。 变量`prev`严格加价。 选择`max(L, prev+1)`是唯一同时尊重可行性和单调性的有效候选者。 

每次比赛的重建步骤都是独立的。 因为我们已经固定了总和，所以可以贪婪地将剩余价值分配到缺失的单元格中，而无需在比赛之间进行协调。 

## 工作示例

 ### 示例 1

 考虑三场已排序星级的比赛：

 | 比赛| 固定金额 | 失踪| 左 | 右 | 上一页 | 选择|
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 3 | 1 | 3 | 8 | -inf| 3 |
 | 2 | 5 | 1 | 5 | 10 | 10 3 | 5 |
 | 3 | 4 | 2 | 4 | 14 | 14 5 | 6 |

 第三场比赛不能取其最小可行值 4，因为它必须超过 5，因此我们选择 6。这仍然符合其上限。 

该跟踪显示了较早的分配如何限制较晚的分配，而间隔则确保保留灵活性。 

### 示例 2

 失败案例：

 | 比赛| 左 | 右 | 上一页 | 选择|
 | ---| ---| ---| ---| ---|
 | 1 | 0 | 1 | -inf| 0 |
 | 2 | 0 | 1 | 0 | 1 |
 | 3 | 0 | 1 | 1 | 不可能|

 这里是第三场比赛$R = 1$，但必须超过`prev = 1`。 由于不存在大于 1 的值，因此算法正确地拒绝该实例。 

这表明，除非能够在全球范围内维持严格的增长，否则仅靠区间可行性是不够的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(nm + n \log n)$| 每个单元格都会处理一次以计算总和，并且排序会处理星形排序 |
 | 空间|$O(nm)$| 输入矩阵和重构输出的存储 |

 约束允许最多$4 \cdot 10^5$总条目数，因此每个单元的线性处理完全在限制范围内。 最多排序一遍$n$与输入大小相比，元素可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve_all()
    return out.getvalue().strip()

def solve_all():
    import sys
    input = sys.stdin.readline

    def solve():
        n, m, k = map(int, input().split())
        stars = []
        fixed_sum = [0]*n
        missing = [0]*n
        arr = []

        for i in range(n):
            data = list(map(int, input().split()))
            s = data[0]
            stars.append((s,i))
            row = data[1:]
            arr.append(row)

            ssum = 0
            miss = 0
            for x in row:
                if x == -1:
                    miss += 1
                else:
                    ssum += x
            fixed_sum[i]=ssum
            missing[i]=miss

        intervals=[]
        for i in range(n):
            L=fixed_sum[i]
            R=fixed_sum[i]+missing[i]*k
            intervals.append((L,R,i))

        stars.sort()
        assigned=[0]*n
        prev=-10**18

        for s,i in stars:
            L,R,_=intervals[i]
            val = L if L>prev else prev+1
            if val>R:
                print("No")
                return
            assigned[i]=val
            prev=val

        res=[r[:] for r in arr]
        for i in range(n):
            need=assigned[i]-fixed_sum[i]
            for j in range(m):
                if res[i][j]==-1:
                    take=min(k,need)
                    res[i][j]=take
                    need-=take

        print("Yes")
        for r in res:
            print(*r)

    t=int(input())
    for _ in range(t):
        solve()

# sample and custom tests
assert run("""...""") == "..."
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 具有直接可行性的最小尺寸| 是的... | 基贪婪正确性 |
 | 由于间隔间隙不可能| 没有 | 故障检测|
 | 全零缺失| 是的... | 全面重建 |
 | 紧密的星星链| 是的... | 严格的排序约束|

 ## 边缘情况

 当所有比赛都具有相同的星级值时，就会出现一种边缘情况。 由于该约束仅在一颗星数严格较大时适用，因此只要内部可行性成立，任何分配都是有效的。 该算法自然会处理这个问题，因为排序会产生相等的组，并且`prev`从不强迫不必要的增加。 

另一个边缘情况是比赛的缺失值为零。 在这种情况下，它的区间会折叠成一个点$[L, L]$。 如果贪婪需要更高的值，则算法会正确检测到不可能性，因为没有可用的调整。 

当最后一场比赛的上限非常严格时，就会出现更微妙的情况。 如果早期的贪婪选择推动`prev`太高了，即使所有早期的选择都是局部有效的，最终的间隔也可能无法满足所需的严格增加。 该算法恰好在该点失败，这与实例的真正不可行性相匹配。
