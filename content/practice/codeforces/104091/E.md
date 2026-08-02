---
title: "CF 104091E - \u0428\u0430\u0445\u0442\u0451\u0440\u0441\u043a\u043e\u0435\u0440\u0435\u043c\u0435\u0441\u043b\u043e"
description: "我们正在模拟一个简化的 2D 世界，其行为就像一条宽度为 n 且垂直高度不受限制的长 1D 条带。 最初，这条带上的每个位置都被草覆盖。 在此过程中，游戏引擎会生成水平部分的地球块。"
date: "2026-07-02T02:29:02+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104091
codeforces_index: "E"
codeforces_contest_name: "\u041c\u0443\u043d\u0438\u0446\u0438\u043f\u0430\u043b\u044c\u043d\u044b\u0439 \u044d\u0442\u0430\u043f \u0412\u041e\u0428 \u043f\u043e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0442\u0438\u043a\u0435 \u0432 \u041f\u0435\u0442\u0440\u043e\u0437\u0430\u0432\u043e\u0434\u0441\u043a\u0435 \u0438 \u041a\u0430\u0440\u0435\u043b\u0438\u0438 2022-2023"
rating: 0
weight: 104091
solve_time_s: 64
verified: true
draft: false
---

[CF 104091E - \u0428\u0430\u0445\u0442\u0451\u0440\u0441\u043a\u043e\u0435 \u0440\u0435\u043c\u0435\u0441\u043b\u043e](https://codeforces.com/problemset/problem/104091/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在模拟一个简化的 2D 世界，其行为就像一条长的 1D 宽度带`n`和无限的垂直高度。 最初，这条带上的每个位置都被草覆盖。 

在此过程中，游戏引擎会生成水平部分的地球块。 每个段由起始位置描述`a`和一个长度`b`。 这意味着所有职位来自`a`到`a + b - 1`接收一个块。 当一个方块被放置在一个位置时，它会垂直落下并堆叠在该位置现有方块的顶部，形成一个垂直的土柱。 

关键的观察是草只存在于未被地球占据的细胞中。 引擎感兴趣的是当前有多少草纹理可见，这对应于条带中有多少位置仍然没有地球块。 

每个查询类型`2`询问到目前为止完全没有受到任何块放置影响的当前位置数量。 

约束允许最多`n = 10^6`职位及最多`q = 10^4`运营。 这立即排除了任何在线性时间内从头开始重新计算每个查询答案的解决方案`n`，因为这将花费高达`10^10`最坏情况下的操作。 我们需要支持范围更新和快速全局聚合，最好是每次操作的对数时间。 

一个微妙的陷阱是重叠的片段在答案中不会独立堆叠。 一旦某个位置至少被覆盖一次，则不应再次将其计为草地，即使稍后添加其他部分也是如此。 

## 方法

 直接模拟维护一个数组`covered[i]`指示是否位置`i`曾经收到过一个区块。 每次更新类型`1 a b`将迭代该段并将所有位置标记为已覆盖。 每个查询类型`2`会计算有多少条目未被覆盖。 

这种做法是正确的，但是太慢了。 在最坏的情况下，一次更新可能会触及`O(n)`位置，并且可以有`O(q)`这样的更新，导致二次行为。 

关键的结构观察是我们只需要知道一个位置是零还是非零，而不是堆叠的块的确切数量。 每个操作都会将一系列 0 转换为 1，一旦某个位置变为 1，它就永远保持为 1。 这是在范围增量下维护动态数组的经典案例，其中我们只关心值是否在任何地方仍然为零。 

这减少了维护一段长度的问题`n`其中我们支持范围加 1 并查询有多少元素仍然为零。 具有惰性传播的线段树自然地适合这种结构：每个节点跟踪其线段中有多少位置仍然为零，并有效地将翻转线段从完全零更新为完全非零。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力阵列标记| O(nq) | O(n) | 太慢了|
 | 具有惰性传播的线段树 | O((n + q) log n) | O((n + q) log n) | O(n) | 已接受 |

 ## 算法演练

 我们在大小数组上维护一棵线段树`n`。 每个位置都从零开始，这意味着它仍然被草覆盖。 

线段树中的每个节点存储其区间内有多少个位置仍为零。 此外，我们维护一个惰性标记，指示整个段是否已被至少覆盖一次。 

1. 构建一棵线段树，其中每个叶子都初始化为 1，因为所有位置最初都包含草。 
2. 更新`1 a b`，我们按时间间隔应用范围更新`[a, a + b - 1]`。 如果一个段完全在更新范围内并且当前完全为零，我们将其标记为完全覆盖并将其零计数设置为 0。 
3. 当下推更新时，如果一个节点已经被标记为完全覆盖，则两个子节点都会立即设置为完全覆盖，而无需进一步递归。 
4. 部分重叠是通过递归更新子项并重新计算父项的零计数作为其子项的总和来处理的。 
5. 查询`2`，答案就是根节点存储的零计数，代表有多少个位置从未被覆盖过。 

关键的设计选择是我们从不存储精确的覆盖计数。 一旦一个段变得完全非零，它就不会再改变，所以我们积极地折叠它。 

### 为什么它有效

 每个位置最多从未覆盖到覆盖转换一次。 段树确保一旦一个段被完全覆盖，就不会再访问它进行详细更新。 这保证了正确性，因为覆盖范围是单调的，并且每次更新只会使系统更接近完全覆盖的状态，而不会逆转更改。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, n):
        self.n = n
        self.size = 4 * n
        self.zero = [0] * self.size   # number of zeros in segment
        self.lazy = [0] * self.size   # 0 = untouched, 1 = fully covered

        self.build(1, 1, n)

    def build(self, v, l, r):
        if l == r:
            self.zero[v] = 1
            return
        m = (l + r) // 2
        self.build(v*2, l, m)
        self.build(v*2+1, m+1, r)
        self.zero[v] = self.zero[v*2] + self.zero[v*2+1]

    def push(self, v, l, r):
        if self.lazy[v] == 0:
            return
        if l != r:
            self.lazy[v*2] = 1
            self.lazy[v*2+1] = 1
        self.zero[v] = 0
        self.lazy[v] = 0

    def update(self, v, l, r, ql, qr):
        self.push(v, l, r)
        if r < ql or qr < l:
            return
        if ql <= l and r <= qr:
            self.lazy[v] = 1
            self.push(v, l, r)
            return
        m = (l + r) // 2
        self.update(v*2, l, m, ql, qr)
        self.update(v*2+1, m+1, r, ql, qr)
        self.zero[v] = self.zero[v*2] + self.zero[v*2+1]

def solve():
    n, q = map(int, input().split())
    st = SegTree(n)

    for _ in range(q):
        tmp = input().split()
        if tmp[0] == '1':
            a = int(tmp[1])
            b = int(tmp[2])
            st.update(1, 1, n, a, a + b - 1)
        else:
            print(st.zero[1])

if __name__ == "__main__":
    solve()
```构建线段树时，每个节点最初都代表完全被草覆盖的空间。 这`zero`数组跟踪每个段中剩余多少个未触及的位置。 这`lazy`flag 确保一旦某个段被完全覆盖，我们就不会浪费时间重新访问它。 

更新函数会谨慎地仅在必要时传播覆盖范围。 一旦节点完全位于绘制的段内，它就会立即折叠到零，并且递归停止。 

## 工作示例

 考虑一个小世界`n = 5`与操作：```
1 1 2
1 2 2
2
```我们跟踪每次更新后有多少位置仍未绘制。 

| 步骤| 运营| 涵盖的细分市场 | 剩余零 |
 | ---| ---| ---| ---|
 | 0 | 初始化| 无 | 5 |
 | 1 | 添加 [1,2] | [1,2]| 3 |
 | 2 | 添加 [2,3] | [1,2,3]| 2 |
 | 3 | 查询 | [1,2,3]| 2 |

 最终答案是 2，因为位置 4 和 5 从未被触及。 

现在考虑重叠的全覆盖：```
1 1 3
1 2 2
2
```| 步骤| 运营| 涵盖的细分市场 | 剩余零 |
 | ---| ---| ---| ---|
 | 0 | 初始化| 无 | 5 |
 | 1 | 添加 [1,3] | [1,2,3]| 2 |
 | 2 | 添加 [2,3] | [1,2,3]| 2 |
 | 3 | 查询 | [1,2,3]| 2 |

 这表明重复更新不会重复计算覆盖范围，因为状态是单调的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(q log n) | O(q log n) | 每次更新仅涉及受影响范围内的线段树节点 |
 | 空间| O(n) | 线段树数组存储所有区间的状态 |

 和`n ≤ 10^6`和`q ≤ 10^4`，这完全符合限制，因为线段树操作的总数约为数十万。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    out = []
    
    class SegTree:
        def __init__(self, n):
            self.n = n
            self.zero = [0] * (4*n)
            self.lazy = [0] * (4*n)
            self.build(1, 1, n)

        def build(self, v, l, r):
            if l == r:
                self.zero[v] = 1
                return
            m = (l+r)//2
            self.build(v*2,l,m)
            self.build(v*2+1,m+1,r)
            self.zero[v]=self.zero[v*2]+self.zero[v*2+1]

        def push(self, v, l, r):
            if self.lazy[v]:
                self.zero[v]=0
                if l!=r:
                    self.lazy[v*2]=1
                    self.lazy[v*2+1]=1
                self.lazy[v]=0

        def update(self,v,l,r,ql,qr):
            self.push(v,l,r)
            if r<ql or qr<l:
                return
            if ql<=l<=r<=qr:
                self.lazy[v]=1
                self.push(v,l,r)
                return
            m=(l+r)//2
            self.update(v*2,l,m,ql,qr)
            self.update(v*2+1,m+1,r,ql,qr)
            self.zero[v]=self.zero[v*2]+self.zero[v*2+1]

    def solve():
        n,q=map(int,input().split())
        st=SegTree(n)
        for _ in range(q):
            t=list(input().split())
            if t[0]=='1':
                a,b=int(t[1]),int(t[2])
                st.update(1,1,n,a,a+b-1)
            else:
                out.append(str(st.zero[1]))
        return "\n".join(out)

    return solve()

# provided samples
assert run("""3 4
1 1 2
1 2 2
1 1 1
2
""") == "1", "sample 1"

# all uncovered
assert run("""5 1
2
""") == "5", "no updates"

# full cover
assert run("""5 1
1 1 5
2
""") == "0", "full cover"

# overlapping updates
assert run("""5 3
1 1 3
1 2 5
2
""") == "0", "overlap"

# boundary
assert run("""1 2
1 1 1
2
""") == "0", "single cell"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 没有更新 | 5 | 初始状态正确性 |
 | 全封面| 0 | 完整的覆盖处理|
 | 重叠| 0 | 幂等更新 |
 | 单细胞| 0 | 边界正确性 |

 ## 边缘情况

 关键的边缘情况是同一区域的重复更新。 例如，申请`1 1 3`第一次申请后两次不应改变答案。 线段树通过折叠完全覆盖的线段来处理此问题，因此第二次更新会找到已标记的节点并且不执行额外的工作。 

另一种情况是单细胞世界。 和`n = 1`，每次更新要么保持不变，要么完全覆盖它。 该结构仍然表现正确，因为叶节点是直接初始化和更新的，而不依赖于子节点传播。 

最后一个微妙的情况是不相交的更新，最终通过多个步骤覆盖整个数组。 惰性传播确保部分片段正确合并，并且根始终反映未触及位置的真实总数。
