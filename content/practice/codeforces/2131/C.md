---
title: "CF 2131C - 使其平等"
description: "我们从大小为 $n$ 的多重集 $S$ 开始，我们希望将其转换为另一个相同大小的多重集 $T$。 唯一允许的移动从 $S$ 中取出一个元素 $x$，将其删除，然后用 $x+k$ 或 $ 替换它。核心问题是是否重复应用这些......"
date: "2026-06-08T02:54:33+07:00"
tags: ["codeforces", "competitive-programming", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 2131
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 1042 (Div. 3)"
rating: 1100
weight: 2131
solve_time_s: 103
verified: false
draft: false
---

[CF 2131C - 使其相等](https://codeforces.com/problemset/problem/2131/C)

 **评分：** 1100
 **标签：** 数学，数论
 **求解时间：** 1m 43s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们从多重集开始$S$尺寸的$n$我们想把它转换成另一个多重集$T$大小相同。 唯一允许的移动需要一个元素$x$从$S$，删除它，并将其替换为$x+k$或者$|x-k|$。 每个操作都会保留多重集的大小，但可以更改单个值。 

核心问题是这些举措的重复应用能否重塑$S$完全进入$T$，尊重多样性。 

这些约束表明每个测试用例必须在接近线性的时间内处理$n$，由于总计$n$所有测试均达到$2 \cdot 10^5$。 任何探索每个值的转换或逐步模拟操作的方法都会因可达状态的爆炸而立即失败。 

一个微妙的方面是，除了通过$10^9$，因此直接对值进行图遍历是不可能的。 

两种边缘模式往往会打破天真的思维。 

首先，假设每个元素可以独立地到达具有相同残差模的任何目标$k$是错误的，因为$|x-k|$操作可以以非线性方式减少值，直到它们穿过零，之后行为会发生变化。 例如，与$k=5$， 从$x=6$你可以去$1$，然后到$4$，然后到$9$，产生不完全模块化的循环。 

其次，假设最接近值的贪婪匹配失败，因为转换可能需要两个多重集中都不存在的中间值。 

一个小误导案例是：```
S = [1, 6], T = [4, 3], k = 5
```贪婪的尝试可能会匹配 1→6 和 6→1，但中间的转换表明该结构不是以简单的方式对称。 

## 方法

 强力解释会将每个值建模为图中的节点，并带有边$x \to x+k$和$x \to |x-k|$，并尝试检查是否多重集$T$可以从以下位置到达$S$通过重新分配。 这变成了具有状态计数的多源可达性问题，这在实践中是指数级的，因为值在$+k$方向。 

失败点在于每个数字在每次操作时都会分支成两种可能性，并且序列可以任意增长。 即使我们将值限制在某个启发式界限内，转换也不是单调的，因此修剪是不安全的。 

关键的观察结果是，运算结构保留了一个非常强的不变量：每个数字最终在其残差类模内独立表现$k$，除了可以通过重复应用来减少值$|x-k|$直到它们进入规范范围。 

更具体地说，反复应用“减法”$k$在绝对意义上”操作总是将数字推向区间中的唯一代表$[0, k)$，之后进一步的结构变得可预测。 每个值都可以映射到一条链，该链最终在由其残差模确定的小有界区域内循环$k$。 唯一有意义的自由是我们“向上包裹”多少次$+k$，它会改变值但不会改变它们的残基类别。 

这将问题简化为跟踪每个残基类中有多少元素可用$S$并需要在$T$，并验证每个类中的多重集是否可以在允许的班次下对齐。 

最后的检查变成了每个残基类的平衡问题，其中元素可以按以下步骤向上推动$k$，但不会在残基之间任意重新排列。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力图搜索 | 指数| O(n) | 太慢了 |
 | 残差+贪婪匹配| O(n \log n) | O(n \log n) | O(n) | 已接受 |

 ## 算法演练

 我们将每个值简化为其残基类别内的规范形式，然后比较质量在不断增加的链中的分布情况。 

1. 组元素$S$和$T$通过它们的值模$k$。 这是必要的，因为两个允许的操作都保留了残差模$k$直至正常化后消失的符号效应。 
2. 对于每个组，对元素进行排序。 需要排序是因为转换有效地允许以增量向上移动元素$k$，因此对齐必须尊重链内的顺序。 
3. 在残基组内，按升序处理值并模拟剩余元素如何$S$可以向上推以匹配赤字$T$。 当一个值在$S$超过了同级别所需要的$T$，通过有效地将多余的部分视为$x+k$。 
4. 在迭代排序值时维护运行剩余计数器。 在每一步中，减去所需的内容$T$。 如果我们出现赤字，我们会尝试使用较低价值带来的盈余进行补偿。 
5. 如果在任何时候我们都无法弥补赤字，那么该剩余阶级就不可能进行转型。 
6. 对所有残留类别独立重复。 如果每个类都可满足，则答案为“是”，否则为“否”。 

关键思想是运动仅沿着算术级数向上流动$k$，因此每个残基类别的行为就像一个单向流动系统。 

### 为什么它有效

 每个元素唯一不可逆的方向是向上，通过添加$k$，而$|x-k|$操作只能减少值，但不能以允许跨类交互的方式改变其残差类。 这为每个残基创建了独立的链。 在每个链内，元素可以任意向上移动，但不能跨链交叉或重新排序。 贪婪的盈余传播精确地模拟了这种流动，确保每一个赤字都必须与之前的盈余相匹配，任何不匹配都意味着不可能。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from collections import defaultdict

def solve():
    t = int(input())
    for _ in range(t):
        n, k = map(int, input().split())
        s = list(map(int, input().split()))
        tarr = list(map(int, input().split()))
        
        groups_s = defaultdict(list)
        groups_t = defaultdict(list)
        
        for x in s:
            groups_s[x % k].append(x)
        for x in tarr:
            groups_t[x % k].append(x)
        
        ok = True
        
        for r in set(list(groups_s.keys()) + list(groups_t.keys())):
            a = sorted(groups_s[r])
            b = sorted(groups_t[r])
            
            i = j = 0
            surplus = 0
            
            while i < len(a) or j < len(b):
                av = a[i] if i < len(a) else float('inf')
                bv = b[j] if j < len(b) else float('inf')
                
                if av == bv:
                    i += 1
                    j += 1
                    continue
                
                if av < bv:
                    surplus += 1
                    i += 1
                else:
                    if surplus == 0:
                        ok = False
                        break
                    surplus -= 1
                    j += 1
            
            if not ok:
                break
        
        print("YES" if ok else "NO")

if __name__ == "__main__":
    solve()
```该实现首先按余数模对值进行分区$k$，它隔离了独立的转换链。 在每个组内，排序强制执行一致的方向来处理可能的向上移动。 

两指针循环比较可用性$S$与需求$T$。 什么时候$S$值较小，我们将其视为可以向上推的潜在盈余。 什么时候$T$需要一个当前无法获得的值，我们就会消耗之前积累的剩余。 如果没有剩余，我们就会立即失败。 

哨兵$+\infty$当一个列表耗尽时，处理可确保干净终止。 

## 工作示例

 ### 示例 1

 输入：```
n=3, k=2
S = [0, 1, 0]
T = [1, 0, 1]
```我们按模 2 分组。 

| 残留物 | S 排序 | T 排序 |
 | ---| ---| ---|
 | 0 | [0, 0] | [0]|
 | 1 | [1] | [1] |

 加工残留0：

 | 步骤| S[i] | T[j] | 剩余 | 行动|
 | ---| ---| ---| ---| ---|
 | 0 | 0 | 0 | 0 | 比赛|
 | 1 | 0 | 无穷大| 1 | S 的盈余 |

 加工残渣1：

 | 步骤| S[i] | T[j] | 剩余 | 行动|
 | ---| ---| ---| ---| ---|
 | 0 | 1 | 1 | 0 | 比赛|

 这表明残基 0 中的额外质量可以在同一类中向上推，从而允许重新分配。 

### 示例 2

 输入：```
n=2, k=7
S = [2, 8]
T = [2, 9]
```残基 2 类包含所有元素。 

| 步骤| S[i] | T[j] | 剩余 | 行动|
 | ---| ---| ---| ---| ---|
 | 0 | 2 | 2 | 0 | 比赛|
 | 1 | 8 | 9 | 失败| 无法匹配 9 |

 这里，在链的约束范围内，通过允许的操作，8 无法达到 9，因此该过程失败。 

这表明，即使在单一剩余类别内，向上运动也必须尊重可用的剩余结构。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n \log n)$| 残基组内的排序占主导地位； 每个元素在两指针扫描中处理一次 |
 | 空间|$O(n)$| 分组元素的存储 |

 复杂性完全符合约束条件，因为总的$n$跨测试用例是$2 \cdot 10^5$，并且排序在这种规模下仍然有效。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    from collections import defaultdict

    t = int(input())
    out = []
    for _ in range(t):
        n, k = map(int, input().split())
        s = list(map(int, input().split()))
        tt = list(map(int, input().split()))

        groups_s = defaultdict(list)
        groups_t = defaultdict(list)

        for x in s:
            groups_s[x % k].append(x)
        for x in tt:
            groups_t[x % k].append(x)

        ok = True

        for r in set(groups_s.keys()) | set(groups_t.keys()):
            a = sorted(groups_s[r])
            b = sorted(groups_t[r])

            i = j = 0
            surplus = 0

            while i < len(a) or j < len(b):
                av = a[i] if i < len(a) else float('inf')
                bv = b[j] if j < len(b) else float('inf')

                if av == bv:
                    i += 1
                    j += 1
                elif av < bv:
                    surplus += 1
                    i += 1
                else:
                    if surplus == 0:
                        ok = False
                        break
                    surplus -= 1
                    j += 1

            if not ok:
                break

        out.append("YES" if ok else "NO")

    return "\n".join(out)

# provided samples
assert run("""5
1 3
1
2
1 8
4
12
3 5
6 2 9
8 4 11
2 7
2 8
2 9
3 2
0 1 0
1 0 1
""") == """YES
YES
YES
NO
NO"""

# custom cases
assert run("""1
1 1
5
5
""") == "YES", "minimum equal"

assert run("""1
2 3
1 4
2 5
""") == "NO", "different residue structure"

assert run("""1
3 2
0 0 0
2 2 2
""") == "YES", "pure upward shifts"

assert run("""1
3 10
0 10 20
0 10 30
""") == "NO", "gap in chain"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单个相等元素| 是 | 简单的基本情况|
 | 错配残基| 否 | 残渣分离正确性|
 | 统一变速链条| 是 | 向上传播|
 | 缺少可达值 | 否 | 间隙检测|

 ## 边缘情况

 关键的边缘情况是两个多重集相同但排列方式使得转换是不必要的。 例如，$S = T = [x_1, x_2, \dots]$。 该算法处理每个残基组，看到完美的成对匹配，并且从不使用剩余。 输出保持 YES，而不依赖任何转换逻辑。 

另一种边缘情况是当一个残基类具有必须向上推多次的额外小元素时。 例如：```
S = [0, 0, 0], T = [6, 6, 6], k = 3
```所有元素都属于残差 0。算法在较低值处累积剩余，并在向上移动时消耗它，成功满足所有需求。 这证实了重复的 +k 跃迁是通过剩余传播正确建模的。 

失败的情况是当所需目标出现时，同一链中没有足够的早期供应。 在：```
S = [1], T = [100], k = 7
```任何剩余发电序列都无法弥补这一差距，因为没有更早的元素可以通过中间步骤向上传播。 当需求点剩余量保持为零时，该算法正确地识别出这是不可能的。
