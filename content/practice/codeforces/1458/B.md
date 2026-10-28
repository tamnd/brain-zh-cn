---
title: "CF 1458B - 玻璃溢出一半"
description: "我们有多达 100 个眼镜。 玻璃杯可以容纳ai单位的水，目前可以容纳bi单位的水。 我们可以在玻璃杯之间移动水。 问题是每次转账都会损失一半的转账金额。"
date: "2026-06-11T02:31:24+07:00"
tags: ["codeforces", "competitive-programming", "dp"]
categories: ["algorithms"]
codeforces_contest: 1458
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 691 (Div. 1)"
rating: 2000
weight: 1458
solve_time_s: 130
verified: true
draft: false
---

[CF 1458B - 玻璃洒了一半](https://codeforces.com/problemset/problem/1458/B)

 **评级：** 2000
 **标签：** dp
 **求解时间：** 2m 10s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有多达 100 个眼镜。 玻璃`i`可以容纳`a_i`水单位，目前含有`b_i`单位。 

我们可以在玻璃杯之间移动水。 问题是每次转账都会损失一半的转账金额。 如果我们倒`x`玻璃单位，仅`x/2`单位有可能到达目的地。 任何超出目的地容量的部分也会丢失。 

对于每一个`k`从`1`到`n`，我们必须准确选择`k`玻璃杯，并在执行任何顺序的转移后最大限度地增加所选玻璃杯内的水量。 

每个的答案`k`是某组内可容纳的最大总水量`k`眼镜。 

约束是实现预期解决方案的第一条线索。 只有 100 个玻璃杯，每个容量和初始数量最多为 100。总容量最多为 10000，总水量也最多为 10000。这对于按容量总和索引的动态编程状态来说足够小，但对于玻璃子集的任何枚举来说太大了，因为`2^100`可能性是完全不可能的。 

问题的微妙部分是了解转移实际上可以实现什么。 

考虑选择一副眼镜`S`。 

让

-`A = Σ a_i`戴在眼镜上`S`-`B = Σ b_i`戴在眼镜上`S`-`T = Σ b_i`在所有眼镜上

 所选眼镜已包含`B`水的单位。 套装之外还有`T - B`单位。 

任何来自外部的水在到达选定的设定之前都会损失 50%。 因此，即使我们全部使用室外的水，最多也`(T - B)/2`可以将额外的单位交付到所选的眼镜中。 

同时，所选玻璃杯的容纳量不能超过总容量`A`。 

因此，在该选定组内可达到的水量为$$\min\left(A,\; B + \frac{T-B}{2}\right)$$粗心的方法常常会错过这两个限制之一。 

例如：```
2
100 0
1 1
```为了`k=1`，选择第一个玻璃的容量为 100，但全球仅存在 1 个单位。 溢出后，最多有 0.5 个到达，所以答案是 0.5，而不是 100。 

反之：```
2
5 5
100 100
```只选择第一块玻璃可以得到$$\min(5,\;5+100/2)=5$$容量限制占主导地位。 

整个问题变成了寻找，对于每一个`k`，最大化该表达式的子集。 

## 方法

 强力解决方案将枚举眼镜的每个子集。 对于每个子集，我们将计算其总容量`A`，其初始水`B`，并评估$$\min\left(A,\; B+\frac{T-B}{2}\right).$$这是正确的，因为表达式充分描述了该子集可实现的数量。 

问题是子集的数量。 和`n = 100`， 有`2^{100}`的可能性，这是一个天文数字。 

关键的观察是子集的值仅取决于两个聚合量：$$A=\sum a_i,\qquad B=\sum b_i.$$一旦知道这些金额，个人身份就不再重要。 

总容量最多为$$100 \cdot 100 = 10000.$$这表明我们采用背包式动态规划，对于每个子集大小和每个容量总和，我们跟踪可获得的最大值`B`。 

假设我们知道，对于每一对`(k, A)`，最大可能值`B`大小子集之间`k`其容量总和为`A`。 

那么该状态的答案很简单$$\min\left(A,\; \frac{T+B}{2}\right),$$因为$$B+\frac{T-B}{2} = \frac{T+B}{2}.$$对于固定`(k, A)`, 较大`B`总是给出一个更大的目标，所以只存储最大值`B`就足够了。 

这将问题转化为具有两个维度的经典 0/1 背包：所选玻璃杯的数量和总容量。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(2^n)$|$O(1)$| 太慢了|
 | 最佳DP |$O(n^2 \cdot \sum a_i)$|$O(n \cdot \sum a_i)$| 已接受 |

 ## 算法演练

 1.读取所有玻璃杯并计算水的总量$$T=\sum b_i.$$2.让`MAXA = Σ a_i`。 
3. 创建一个DP表，其中$$dp[j][s]$$储存最大初始总水量`B`可以通过精确选择得到`j`其容量总和为的眼镜`s`。 

不可达状态被初始化为`-1`。 
4. 设置$$dp[0][0]=0.$$5. 一张一张地处理眼镜。 

对于一杯`(a,b)`, 迭代`j`和`s`按降序排列并执行标准 0/1 背包转换：$$dp[j+1][s+a] = \max(dp[j+1][s+a],\, dp[j][s]+b).$$降序迭代可以防止多次使用同一个玻璃。 
6. 处理完所有眼镜后，计算每个眼镜的答案`k`。 
7. 对于每个可达状态`(k,s)`有储值`B`， 评价$$\min\left(s,\frac{T+B}{2}\right).$$这是该特定骨料对可达到的最大水量`(A=s,B)`。 
8. 取属于同一状态的所有状态中的最大值`k`。 
9. 以足够的精度输出所有答案。 

### 为什么它有效

 修理任何选定的眼镜。 

让`A`是他们的总容量和`B`他们最初的水。 剩余的玻璃杯含有`T-B`单位。 

每个从外部到达的单位都必须至少转移一次，因此最多有一半的外部水最终会进入所选的组内。 因此，可以收集到所选玻璃杯中的总水最多为$$B+\frac{T-B}{2} = \frac{T+B}{2}.$$所选玻璃杯的容量也不能超过其总容量`A`。 因此任何策略都无法超越$$\min\left(A,\frac{T+B}{2}\right).$$这个界限是可以实现的。 将所有水保留在所选组内。 根据需要将外部水转移至所选装置。 最多可输送一半的外部水，一旦达到容量即可停止该过程`A`已达到。 因此该子集的确切最优值等于$$\min\left(A,\frac{T+B}{2}\right).$$DP 枚举每个可能的对`(A,B)`可通过大小子集实现`k`。 对于每个容量总和`A`，它存储最大可能的`B`，这已经足够了，因为目标单调增加`B`。 因此，为每个计算的最大值`k`正是全局最优值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    glasses = []
    total_water = 0
    total_capacity = 0

    for _ in range(n):
        a, b = map(int, input().split())
        glasses.append((a, b))
        total_water += b
        total_capacity += a

    dp = [[-1] * (total_capacity + 1) for _ in range(n + 1)]
    dp[0][0] = 0

    current_capacity_sum = 0

    for a, b in glasses:
        for cnt in range(n - 1, -1, -1):
            for cap in range(current_capacity_sum, -1, -1):
                if dp[cnt][cap] == -1:
                    continue

                nxt_cap = cap + a
                nxt_water = dp[cnt][cap] + b

                if nxt_water > dp[cnt + 1][nxt_cap]:
                    dp[cnt + 1][nxt_cap] = nxt_water

        current_capacity_sum += a

    ans = [0.0] * (n + 1)

    for k in range(1, n + 1):
        best = 0.0

        for cap in range(total_capacity + 1):
            inside_water = dp[k][cap]
            if inside_water == -1:
                continue

            value = min(float(cap), (total_water + inside_water) / 2.0)
            if value > best:
                best = value

        ans[k] = best

    print(*("{:.10f}".format(x) for x in ans[1:]))

if __name__ == "__main__":
    solve()
```DP 表是解决方案的核心。`dp[k][cap]`不直接存储答案。 相反，它在所有大小子集中存储了最大可能的初始存在水量`k`其容量总和为`cap`。 

这种选择使得状态空间变得易于管理。 容量总和最多只能达到 10000，因此整个 DP 包含大约一百万个状态。 

下降循环是必不可少的。 如果按递增顺序处理容量，则玻璃可能会在同一迭代中多次重复使用，从而将过渡转变为无界背包并产生错误的结果。 

背包完成后，每个可达状态对应于某个子集聚合`(A,B)`。 公式$$\min\left(A,\frac{T+B}{2}\right)$$直接评估，并保留每个子集大小的最佳值。 

不存在整数溢出问题，因为所有总和最多为 10000。 

## 工作示例

 ### 示例 1

 输入：```
3
6 5
6 5
10 2
```总水量：$$T=12$$加工所有玻璃后相关DP状态：

 | k | 容量A | 水B |
 | ---| ---| ---|
 | 1 | 6 | 5 |
 | 1 | 10 | 10 2 |
 | 2 | 12 | 12 10 | 10
 | 2 | 16 | 16 7 |
 | 3 | 22 | 22 12 | 12

 评价：

 | k | 一个 | 乙| 分钟（A，（T + B）/ 2）|
 | ---| ---| ---| ---|
 | 1 | 6 | 5 | 6 |
 | 1 | 10 | 10 2 | 7 |
 | 2 | 12 | 12 10 | 10 11 | 11
 | 2 | 16 | 16 7 | 9.5 | 9.5
 | 3 | 22 | 22 12 | 12 12 | 12

 最佳答案:

 | k | 回答 |
 | ---| ---|
 | 1 | 7 |
 | 2 | 11 | 11
 | 3 | 12 | 12

 这个例子显示了两个限制因素。 为了`k=1`，尽管初始水量较少，但容量较大的玻璃会获胜，因为它可以接收从其他地方溢出的水。 

### 示例 2

 输入：```
2
100 0
1 1
```总水量：$$T=1$$国家：

 | k | 一个 | 乙|
 | ---| ---| ---|
 | 1 | 100 | 100 0 |
 | 1 | 1 | 1 |
 | 2 | 101 | 101 1 |

 评价：

 | k | 一个 | 乙| 价值|
 | ---| ---| ---| ---|
 | 1 | 100 | 100 0 | 0.5 | 0.5
 | 1 | 1 | 1 | 1 |
 | 2 | 101 | 101 1 | 1 |

 答案：

 | k | 回答 |
 | ---| ---|
 | 1 | 1 |
 | 2 | 1 |

 这表明，当全球可用水不足时，仅靠巨大的容量是没有用的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n^2 \cdot \sum a_i)$| 背包随子集大小和容量的变化 |
 | 空间|$O(n \cdot \sum a_i)$| DP表|

 自从`n ≤ 100`和`Σa_i ≤ 10000`，DP州数量约为100万。 总的转换次数大约是`100 × 100 × 10000 = 10^8`，但实际实现仅在可达到的容量范围内进行迭代，并在优化的 Python 中轻松通过竞赛限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n = int(input())

    glasses = []
    total_water = 0
    total_capacity = 0

    for _ in range(n):
        a, b = map(int, input().split())
        glasses.append((a, b))
        total_water += b
        total_capacity += a

    dp = [[-1] * (total_capacity + 1) for _ in range(n + 1)]
    dp[0][0] = 0

    cur = 0

    for a, b in glasses:
        for k in range(n - 1, -1, -1):
            for s in range(cur, -1, -1):
                if dp[k][s] == -1:
                    continue
                dp[k + 1][s + a] = max(
                    dp[k + 1][s + a],
                    dp[k][s] + b
                )
        cur += a

    ans = []

    for k in range(1, n + 1):
        best = 0.0
        for s in range(total_capacity + 1):
            B = dp[k][s]
            if B == -1:
                continue
            best = max(best, min(float(s), (total_water + B) / 2.0))
        ans.append(f"{best:.10f}")

    return " ".join(ans) + "\n"

# sample
out = run(
"""3
6 5
6 5
10 2
"""
).strip().split()

assert abs(float(out[0]) - 7.0) < 1e-9
assert abs(float(out[1]) - 11.0) < 1e-9
assert abs(float(out[2]) - 12.0) < 1e-9

# minimum size
out = run(
"""1
5 3
"""
).strip()
assert abs(float(out) - 3.0) < 1e-9

# empty water except one glass
out = run(
"""2
100 0
1 1
"""
).strip().split()
assert abs(float(out[0]) - 1.0) < 1e-9
assert abs(float(out[1]) - 1.0) < 1e-9

# all equal glasses
out = run(
"""3
10 10
10 10
10 10
"""
).strip().split()
assert abs(float(out[0]) - 10.0) < 1e-9
assert abs(float(out[1]) - 20.0) < 1e-9
assert abs(float(out[2]) - 30.0) < 1e-9

# capacity bottleneck
out = run(
"""2
5 5
100 100
"""
).strip().split()
assert abs(float(out[0]) - 100.0) < 1e-9
assert abs(float(out[1]) - 105.0) < 1e-9
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单玻| 现有水量| 基本情况|
 | 一杯满的和一杯几乎空的| 传输损耗行为| 半溢出规则|
 | 所有眼镜均相同 | 对称处理 | 不依赖于订购|
 | 产能瓶颈实例| 容量上限占主导地位| 正确使用`min(A, ...)`|

 ## 边缘情况

 考虑：```
2
100 0
1 1
```为了`k=1`，选择大玻璃可以得到`A=100`,`B=0`。 该算法评估$$\min(100,(1+0)/2)=0.5.$$选择小玻璃可以提供$$\min(1,(1+1)/2)=1.$$DP 保留两个状态并返回较大的值，这是正确的。 

现在考虑：```
2
5 5
100 100
```仅选择第一块玻璃产量$$A=5,\quad B=5.$$公式给出$$\min(5,(105)/2)=5.$$即使其他地方存在大量的水，所选择的玻璃也不能超过其容量。 该算法通过以下方式自动强制执行此操作：`min`。 

最后：```
3
10 0
10 0
10 0
```所有州都有`B=0`和总水量`T=0`。 每个评估都为零，因此每个答案都恰好为零。 DP 正确处理最初不含水的玻璃杯，因为`0`被存储为有效的可达水量总和，而不是与无法达到的状态相混淆。
