---
title: "CF 102803I - InkBall FX"
description: "游戏可以被视为一条从左向右移动的射线。 球的水平坐标始终以速度 1 增加，因此 t 秒后球位于 x = t 处。"
date: "2026-07-26T16:25:27+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102803
codeforces_index: "I"
codeforces_contest_name: "The 15th Heilongjiang Provincial Collegiate Programming Contest"
rating: 0
weight: 102803
solve_time_s: 51
verified: true
draft: false
---

[CF 102803I - InkBall FX](https://codeforces.com/problemset/problem/102803/I)

 **评级：** -
 **标签：** -
 **求解时间：** 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 游戏可以被视为一条从左向右移动的射线。 球的横坐标总是以速度1增加，所以之后`t`球所在的秒数`x = t`。 唯一变化的部分是垂直方向：它开始增加，每次球接触水平部分时，垂直速度都会翻转。 

一段`(L, R, Y)`当当前轨迹到达高度时被击中`Y`在某个水平坐标之间`L`和`R`。 被击中后，该部分就会消失，因此不再需要考虑相同的障碍物。 

输入最多包含`10^5`水平段。 在每次碰撞后检查每个段的直接模拟需要最多`10^10`检查，这远远超出了 6 秒的限制允许的范围。 我们需要一种对数或近线性方法。 

棘手的情况是由于触摸端点也算作碰撞这一事实引起的。 一个片段如：```
1
3 5 2
```被击中，因为初始路径是`y=x`，并且达到`(2,2)`在该段之前，不`(3,2)`，所以答案是`0`。 仅检查高度而忽略 x 范围的粗心实现可能会错误地计算它。 

另一个常见的错误是忘记恰好在端点发生的碰撞是有效的：```
1
2 4 2
```球到达`(2,2)`，这是线段的左端点，所以答案是`1`。 

反思后出现第三个问题：```
2
4 6 1
2 4 3
```第一次碰撞发生在高度处的段`3`当球到达`(3,3)`。 方向改变了，第二段永远不会被击中。 假设球总是沿着原始对角线移动的解决方案在这里失败了。 

## 方法

 一种简单的方法是通过检查每个剩余的段来重复查找下一个冲突。 对于每个线段，我们计算当前射线是否与其相交并保留最早的射线。 这是正确的，因为球只向前移动`x`，所以第一个交叉点正是下一个事件。 然而，每次碰撞后，都会删除一个段，在最坏的情况下，我们执行大约`n + (n-1) + ... + 1`检查，即`O(n^2)`。 

关键的观察是具有斜率的射线`1`或者`-1`可以用一个常数来描述。 

当小球向上运动时，其路径为：```
y = x + c
```在哪里`c = y - x`。 当该值位于其中时，将命中段：```
Y - R <= c <= Y - L
```对于固定的`c`，碰撞位置为`x = Y - c`，所以在所有匹配段中我们需要最小的`Y`。 

当球向下运动时，其路径为：```
y = -x + c
```在哪里`c = y + x`。 有效间隔变为：```
Y + L <= c <= Y + R
```碰撞位置为`x = c - Y`，所以我们需要最大的`Y`。 

问题变成了两个动态间隔刺探查询。 每个段被插入到两个区间结构中。 查询给出了覆盖一个点的区间中的最佳线段，在使用它之后我们懒惰地删除它。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(n) | 太慢了 |
 | 最佳 | O(n log n) | O(n log n) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 1. 将每个段转换为两个变换后的区间。 向上结构存储`[Y-R, Y-L]`有价值`Y`，向下的结构存储`[Y+L, Y+R]`有价值`Y`。 
2. 为每个方向构建压缩的坐标线段树。 每个节点都存储一堆段，这些段的变换间隔完全覆盖该节点。 
3. 开始模拟`(0,0)`方向向上。 
4. 对于当前方向，计算相应的常数。 如果向上移动的话是`y-x`; 否则就是`y+x`。 
5、查询对应的线段树。 查询返回最早可能发生冲突的段。 如果不存在段，则模拟结束。 
6. 通过将找到的段标记为已删除来删除它。 当删除的元素到达顶部时，堆会延迟删除它们。 
7. 将球移动到碰撞点。 x 坐标成为碰撞位置。 翻转垂直方向并重复。 

为什么它有效：

 线段树不变量是每个活动线段恰好出现在其坐标范围完全被其变换区间覆盖的节点中。 查询访问所查询坐标路径上的每个节点，因此它会看到可能发生冲突的每个段。 堆排序选择这些候选者中最接近的冲突。 由于每次碰撞都会永久删除一个段，因此每次操作最多执行一次`n`次。 

## Python 解决方案```python
import sys
import heapq
input = sys.stdin.readline

class SegmentTree:
    def __init__(self, coords, mode):
        self.coords = coords
        self.n = len(coords)
        self.tree = [[] for _ in range(self.n * 4)]
        self.mode = mode
        self.deleted = None

    def add(self, node, l, r, ql, qr, item):
        if ql <= l and r <= qr:
            heapq.heappush(self.tree[node], item)
            return
        m = (l + r) // 2
        if ql <= m:
            self.add(node * 2, l, m, ql, qr, item)
        if m < qr:
            self.add(node * 2 + 1, m + 1, r, ql, qr, item)

    def query(self, node, l, r, pos):
        while self.tree[node] and self.deleted[self.tree[node][0][1]]:
            heapq.heappop(self.tree[node])

        best = self.tree[node][0] if self.tree[node] else None
        if l != r:
            m = (l + r) // 2
            if pos <= m:
                other = self.query(node * 2, l, m, pos)
            else:
                other = self.query(node * 2 + 1, m + 1, r, pos)
            if other is not None:
                if best is None:
                    best = other
                elif self.mode == 1 and other[0] < best[0]:
                    best = other
                elif self.mode == -1 and other[0] < best[0]:
                    best = other
        return best

def build_coords(intervals):
    a = []
    for l, r, _, _ in intervals:
        a.append(l)
        a.append(r)
    a.sort()
    res = []
    for x in a:
        if not res or res[-1] != x:
            res.append(x)
    extra = []
    for i in range(len(res) - 1):
        if res[i + 1] - res[i] > 1:
            extra.append((res[i] + res[i + 1]) // 2)
    res.extend(extra)
    res.sort()
    return res

def solve_case(segs):
    n = len(segs)
    up = []
    down = []

    for i, (l, r, y) in enumerate(segs):
        up.append((y - r, y - l, y, i))
        down.append((y + l, y + r, y, i))

    cu = build_coords(up)
    cd = build_coords(down)

    tree_up = SegmentTree(cu, 1)
    tree_down = SegmentTree(cd, -1)

    deleted = [False] * n
    tree_up.deleted = deleted
    tree_down.deleted = deleted

    import bisect

    for l, r, y, i in up:
        tree_up.add(1, 0, len(cu) - 1,
                    bisect.bisect_left(cu, l),
                    bisect.bisect_right(cu, r) - 1,
                    (y, i))

    for l, r, y, i in down:
        tree_down.add(1, 0, len(cd) - 1,
                      bisect.bisect_left(cd, l),
                      bisect.bisect_right(cd, r) - 1,
                      (-y, i))

    x = 0
    y = 0
    direction = 1
    ans = 0

    while True:
        if direction == 1:
            c = y - x
            p = bisect.bisect_left(cu, c)
            if p == len(cu) or cu[p] != c:
                p -= 1
            if p < 0:
                break
            res = tree_up.query(1, 0, len(cu) - 1, p)
            if res is None:
                break
            ny, idx = res
            nx = ny - c
        else:
            c = y + x
            p = bisect.bisect_left(cd, c)
            if p == len(cd) or cd[p] != c:
                p -= 1
            if p < 0:
                break
            res = tree_down.query(1, 0, len(cd) - 1, p)
            if res is None:
                break
            ny, idx = -res[0], res[1]
            nx = c - ny

        deleted[idx] = True
        ans += 1
        x = nx
        y = ny
        direction *= -1

    return ans

def main():
    t = int(input())
    out = []
    for _ in range(t):
        n = int(input())
        segs = [tuple(map(int, input().split())) for _ in range(n)]
        out.append(str(solve_case(segs)))
    print("\n".join(out))

if __name__ == "__main__":
    main()
```变换后的区间是实现的核心。 线段树不直接存储碰撞位置，因为每次碰撞后当前轨迹都会发生变化。 相反，它存储描述所有可能轨迹的常量。 

堆包含段 ID，因此删除是懒惰的。 删除的段可能会保留在多个堆内，但一旦到达顶部就会被忽略。 这避免了从许多树节点中进行昂贵的删除。 

所有坐标均使用 Python 整数处理，因此即使中间值可能超出原始坐标范围，也不存在溢出问题。 

## 工作示例

 对于第一个样本：```
3
4 6 1
2 4 3
5 6 3
```| 步骤| 方向 | 当前位置 | 恒定| 打|
 | ---| ---| ---| ---| ---|
 | 1 | 上 | (0,0) | (0,0) | 0 | 段 (2,4,3) |
 | 2 | 向下| (3,3) | 6 | 无 |

 第一次打击发生是因为`y=x`达到高度`3`在`x=3`。 反射后，向下的光线不会与另一条剩余线段相遇。 

对于第二个样本：```
2
3 4 1
1 2 2
```| 步骤| 方向 | 当前位置 | 恒定| 打|
 | ---| ---| ---| ---| ---|
 | 1 | 上 | (0,0) | (0,0) | 0 | 段 (1,2,2) |
 | 2 | 向下| (2,2) | 4 | 线段 (3,4,1) |

 第一次碰撞发生在终点`(2,2)`。 然后反射光线到达第二段`(3,1)`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 每个段都插入到两棵树中，每次碰撞都执行对数查询。 |
 | 空间| O(n log n) | O(n log n) | 每个区间存储在对数个线段树节点中。 |

 最大为`10^5`处理段是因为算法在碰撞期间从不扫描所有活动段。 每个段参与有限数量的堆操作。 

## 测试用例```
# The following tests can be used with the solve_case logic.

assert solve_case([(4, 6, 1), (2, 4, 3), (5, 6, 3)]) == 2
assert solve_case([(3, 4, 1), (1, 2, 2)]) == 2
assert solve_case([(1, 2, 5)]) == 0
assert solve_case([(1, 3, 1)]) == 1
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 有一段从未触及| 0 | 检查缺失的碰撞处理 |
 | 端点碰撞 | 1 | 检查包含边界 |
 | 反射样本| 2 | 检查方向变化 |
 | 多个活动间隔 | 正确的第一击 | 检查堆排序 |

 ## 边缘情况

 仅在端点处被触摸的段以闭合变换间隔存储，因此两个端点都保持有效的查询位置。 坐标压缩还保留每个原始端点，防止意外删除边界情况。 

当多个段可以在同一变换坐标处命中时，堆排序会选择碰撞 x 坐标最小的段。 这直接从变换后的方程得出：对于向上运动，x 坐标是`Y-c`，对于向下运动，它是`c-Y`。 

发生冲突后，该段仅被标记为已删除。 它可能仍然存在于内部堆中，但每个查询都会在使用无效条目之前删除它们。 这在保持快速实施的同时保留了正确性。
